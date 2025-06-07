# Real-Time Chat Application Scripts

This directory contains several shell scripts to help you manage the Real-Time Chat Application easily.

## Available Scripts

### 🚀 `start-app.sh` - Production Start
**Main startup script for the application**

```bash
./start-app.sh
```

**What it does:**
- ✅ Kills any processes on ports 3030 and 5050
- ✅ Checks for Node.js and npm installation
- ✅ Verifies MongoDB connection
- ✅ Installs dependencies if missing
- ✅ Builds the backend (TypeScript compilation)
- ✅ Starts backend server on port 5050
- ✅ Starts frontend server on port 3030
- ✅ Opens the application in your browser
- ✅ Monitors server health
- ✅ Creates log files for debugging

**Output:**
- Frontend: http://localhost:3030
- Backend: http://localhost:5050
- Logs: `logs/backend.log` and `logs/frontend.log`

---

### 🔥 `dev.sh` - Development Mode
**Development script with hot reloading**

```bash
./dev.sh
```

**What it does:**
- ✅ Kills any processes on required ports
- ✅ Starts backend in watch mode (auto-restart on changes)
- ✅ Starts frontend in development mode (auto-refresh)
- ✅ Opens application in browser
- ✅ Provides real-time monitoring
- ✅ Easy Ctrl+C to stop both servers

**Best for:** Development workflow with automatic restarts

---

### 🛑 `stop-app.sh` - Stop All Servers
**Safely stops all application servers**

```bash
./stop-app.sh
```

**What it does:**
- ✅ Gracefully stops frontend (port 3030)
- ✅ Gracefully stops backend (port 5050)
- ✅ Force kills if needed
- ✅ Cleans up any remaining Node.js processes
- ✅ Preserves log files for debugging

---

## Quick Start Guide

### First Time Setup
```bash
# 1. Make scripts executable (already done)
chmod +x *.sh

# 2. Start the application
./start-app.sh
```

### Development Workflow
```bash
# Start in development mode
./dev.sh

# Make your changes...
# Servers will auto-restart/refresh

# Stop when done
# Press Ctrl+C or run:
./stop-app.sh
```

### Production Deployment
```bash
# Start production servers
./start-app.sh

# Stop when needed
./stop-app.sh
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 3030 | http://localhost:3030 |
| Backend (Node.js) | 5050 | http://localhost:5050 |
| MongoDB | 27017 | localhost:27017 |

## Log Files

All scripts create log files in the `logs/` directory:

```bash
# View live logs
tail -f logs/backend.log      # Production backend
tail -f logs/frontend.log     # Production frontend
tail -f logs/backend-dev.log  # Development backend
tail -f logs/frontend-dev.log # Development frontend

# View last 20 lines
tail -20 logs/backend.log

# Clear logs
rm -rf logs/
```

## Troubleshooting

### Port Already in Use
The scripts automatically kill processes on required ports, but if you get errors:

```bash
# Manual port cleanup
lsof -ti:3030 | xargs kill -9  # Frontend
lsof -ti:5050 | xargs kill -9  # Backend

# Or use the stop script
./stop-app.sh
```

### MongoDB Not Running
Start MongoDB service:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Dependencies Issues
```bash
# Reinstall dependencies
cd client && rm -rf node_modules && npm install
cd ../server && rm -rf node_modules && npm install
```

### Build Failures
```bash
# Clean build
cd server
rm -rf dist/
npm run build
```

## Script Features

### ✅ Automatic Features
- Port conflict resolution
- Dependency checking
- MongoDB connection verification
- Browser auto-opening
- Health monitoring
- Graceful shutdown
- Error logging

### 🔧 Customization
You can modify the scripts for your needs:
- Change ports in the scripts
- Add additional services
- Modify logging behavior
- Add custom startup commands

## Environment Requirements

- **Node.js** (v16+ recommended)
- **npm** (comes with Node.js)
- **MongoDB** (running on localhost:27017)
- **Unix-like OS** (macOS, Linux, WSL)

## Support

If you encounter issues:
1. Check the log files in `logs/` directory
2. Ensure MongoDB is running
3. Verify Node.js and npm versions
4. Try running `./stop-app.sh` then `./start-app.sh`

---

**Happy coding! 🚀**
