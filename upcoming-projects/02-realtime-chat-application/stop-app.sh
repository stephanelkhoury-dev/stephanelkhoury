#!/bin/bash

# Real-Time Chat Application Stop Script
# This script stops both backend and frontend servers

echo "🛑 Stopping Real-Time Chat Application..."
echo "======================================"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Looking for processes on port $port ($service_name)..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "⚠️  Found processes on port $port. Stopping them..."
        echo "$pids" | xargs kill -TERM 2>/dev/null
        
        # Wait for graceful shutdown
        sleep 3
        
        # Check if processes are still running and force kill if necessary
        local remaining_pids=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$remaining_pids" ]; then
            echo "🔨 Force killing remaining processes on port $port..."
            echo "$remaining_pids" | xargs kill -9 2>/dev/null
            sleep 1
        fi
        
        echo "✅ Stopped processes on port $port"
    else
        echo "✅ No processes found on port $port"
    fi
}

# Stop both servers
kill_port 3030 "Frontend (React)"
kill_port 5050 "Backend (Node.js/Express)"

# Also kill any node processes that might be related to our app
echo ""
echo "🔍 Checking for any remaining Node.js processes..."

# Find Node.js processes that might be our app
CHAT_PROCESSES=$(ps aux | grep -E "(chat-server|chat-client|react-scripts)" | grep -v grep | awk '{print $2}')

if [ -n "$CHAT_PROCESSES" ]; then
    echo "⚠️  Found chat application processes. Stopping them..."
    echo "$CHAT_PROCESSES" | xargs kill -TERM 2>/dev/null
    sleep 2
    
    # Check if any are still running and force kill
    REMAINING_PROCESSES=$(ps aux | grep -E "(chat-server|chat-client|react-scripts)" | grep -v grep | awk '{print $2}')
    if [ -n "$REMAINING_PROCESSES" ]; then
        echo "🔨 Force killing remaining chat processes..."
        echo "$REMAINING_PROCESSES" | xargs kill -9 2>/dev/null
    fi
    echo "✅ Chat application processes stopped"
else
    echo "✅ No chat application processes found"
fi

# Clean up log files (optional)
echo ""
echo "🧹 Cleaning up..."

if [ -d "logs" ]; then
    echo "📝 Log files preserved in logs/ directory"
    echo "   To view recent logs:"
    echo "   - Backend:  tail -20 logs/backend.log"
    echo "   - Frontend: tail -20 logs/frontend.log"
    echo ""
    echo "   To clear logs: rm -rf logs/"
fi

echo ""
echo "✅ Real-Time Chat Application stopped successfully!"
echo "======================================"
echo ""
echo "🚀 To start the application again, run: ./start-app.sh"
