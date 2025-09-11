#!/bin/bash

# UniFlow Application Startup Script

echo "🚀 Starting UniFlow Application..."
echo "=================================="

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

# Install server dependencies if needed
echo "📦 Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build server
echo "🔨 Building server..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

# Install client dependencies if needed
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build client
echo "🔨 Building client..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "To run the application:"
echo "1. Start the server: cd server && npm start"
echo "2. Start the client: cd client && npm run dev"
echo ""
echo "Server will run on: http://localhost:5001"
echo "Client will run on: http://localhost:5173"
echo ""
echo "🎉 UniFlow is ready to use!"