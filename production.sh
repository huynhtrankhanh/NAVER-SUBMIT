#!/bin/bash

# UniFlow Production Server Setup Script

echo "🚀 Building UniFlow for Production..."
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed  
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Set the port (default to 5001 if PORT is not set)
export PORT=${PORT:-5001}

# Install server dependencies if needed
echo "📦 Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install client dependencies if needed
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build client for production
echo "🔨 Building client for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

# Build server
echo "🔨 Building server..."
cd ../server
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

echo "✅ Production build completed successfully!"
echo ""
echo "🚀 Starting production server..."
echo "Production server will serve both frontend and backend on port $PORT"
echo "Access your application at: http://localhost:$PORT"
echo ""
echo "API endpoints available:"
echo "  - GET  /api/health    - Server health check"
echo "  - POST /api/schedule  - Schedule notifications"  
echo "  - POST /api/cancel    - Cancel notifications"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the production server
NODE_ENV=production npm start