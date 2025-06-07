#!/bin/bash

# Development Mode Script
# Starts both servers with automatic restart on file changes

echo "🔥 Starting Real-Time Chat Application in Development Mode..."
echo "======================================"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Checking port $port ($service_name)..."
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "🛑 Killing processes on port $port..."
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 1
        echo "✅ Port $port cleared"
    fi
}

# Clean up ports
kill_port 3030 "Frontend"
kill_port 5050 "Backend"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "📂 Project directory: $(pwd)"

# Create logs directory
mkdir -p logs

echo ""
echo "🚀 Starting development servers..."

# Start backend in development mode
echo "🔙 Starting backend in watch mode..."
cd server
if [ -f "package.json" ] && grep -q "\"dev\"" package.json; then
    npm run dev > ../logs/backend-dev.log 2>&1 &
else
    npm run start > ../logs/backend-dev.log 2>&1 &
fi
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in development mode
echo "🎨 Starting frontend in development mode..."
cd client
npm run dev > ../logs/frontend-dev.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

echo ""
echo "🎉 Development servers started!"
echo "======================================"
echo "📱 Frontend: http://localhost:3030"
echo "🔙 Backend:  http://localhost:5050"
echo "📊 Backend PID: $BACKEND_PID"
echo "📊 Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Development logs:"
echo "   Backend:  tail -f logs/backend-dev.log"
echo "   Frontend: tail -f logs/frontend-dev.log"
echo ""
echo "🔄 Auto-restart is enabled for file changes"
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup when script is interrupted
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    kill_port 3030 "Frontend"
    kill_port 5050 "Backend"
    echo "✅ Development servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Monitor servers and show status
echo "🌐 Opening application in browser..."
if command -v open >/dev/null; then
    open http://localhost:3030
fi

echo ""
echo "💚 Development mode active - monitoring servers..."
echo "   (Press Ctrl+C to stop)"
echo ""

# Keep script running and monitor server health
while true; do
    sleep 10
    
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo "❌ Backend server stopped unexpectedly!"
        echo "📝 Last backend log:"
        tail -10 logs/backend-dev.log
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo "❌ Frontend server stopped unexpectedly!"
        echo "📝 Last frontend log:"
        tail -10 logs/frontend-dev.log
        break
    fi
done

cleanup
