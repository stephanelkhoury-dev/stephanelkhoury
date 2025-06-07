#!/bin/bash

# Real-Time Chat Application Startup Script
# This script kills any processes on required ports and starts both backend and frontend

echo "🚀 Starting Real-Time Chat Application..."
echo "======================================"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local process_name=$2
    
    echo "🔍 Checking for processes on port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "⚠️  Found processes on port $port. Killing them..."
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 2
        echo "✅ Killed processes on port $port"
    else
        echo "✅ Port $port is free"
    fi
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required tools are installed
echo "🔧 Checking dependencies..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Kill processes on required ports
echo ""
echo "🛑 Cleaning up ports..."
kill_port 3030 "Frontend (React)"
kill_port 5050 "Backend (Node.js/Express)"

# Navigate to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "📂 Current directory: $(pwd)"

# Check if MongoDB is running (optional check)
echo ""
echo "🍃 Checking MongoDB connection..."
if ! command_exists mongod; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is running on localhost:27017"
else
    # Try to connect to MongoDB
    if mongosh --eval "db.runCommand({ping:1})" --quiet localhost:27017/test >/dev/null 2>&1 || mongo --eval "db.runCommand({ping:1})" --quiet localhost:27017/test >/dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB might not be running. Please ensure MongoDB is started."
        echo "   You can start MongoDB with: brew services start mongodb-community"
    fi
fi

# Install dependencies if node_modules don't exist
echo ""
echo "📦 Checking and installing dependencies..."

# Check backend dependencies
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
else
    echo "✅ Backend dependencies already installed"
fi

# Check frontend dependencies
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

# Build backend (TypeScript compilation)
echo ""
echo "🔨 Building backend..."
cd server
if [ -f "tsconfig.json" ]; then
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Backend build failed!"
        exit 1
    fi
    echo "✅ Backend built successfully"
else
    echo "⚠️  No tsconfig.json found, skipping build step"
fi
cd ..

# Create log directory for storing output
mkdir -p logs

echo ""
echo "🚀 Starting servers..."

# Start backend server in background
echo "🔙 Starting backend server on port 5050..."
cd server
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
else
    echo "❌ Backend server failed to start. Check logs/backend.log for details."
    cat logs/backend.log
    exit 1
fi

# Start frontend server in background
echo "🎨 Starting frontend server on port 3030..."
cd client
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend server started (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend server failed to start. Check logs/frontend.log for details."
    cat logs/frontend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Real-Time Chat Application is now running!"
echo "======================================"
echo "📱 Frontend: http://localhost:3030"
echo "🔙 Backend:  http://localhost:5050"
echo "📊 Backend PID: $BACKEND_PID"
echo "📊 Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs are being written to:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "📋 To view logs in real-time:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: ./stop-app.sh"
echo ""
echo "🌐 Opening application in browser..."

# Try to open the application in the default browser
if command_exists open; then
    # macOS
    open http://localhost:3030
elif command_exists xdg-open; then
    # Linux
    xdg-open http://localhost:3030
elif command_exists start; then
    # Windows (Git Bash)
    start http://localhost:3030
else
    echo "Please open http://localhost:3030 in your browser"
fi

echo ""
echo "✨ Application startup complete!"
echo "Press Ctrl+C to stop this script (servers will continue running in background)"

# Keep the script running to show live status
while true; do
    sleep 30
    
    # Check if both servers are still running
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo "⚠️  Backend server (PID: $BACKEND_PID) has stopped!"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo "⚠️  Frontend server (PID: $FRONTEND_PID) has stopped!"
        break
    fi
    
    echo "💚 Both servers are running healthy ($(date))"
done

echo "🛑 Some servers have stopped. Please check the logs and restart if needed."
