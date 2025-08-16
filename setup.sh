#!/bin/bash

# AI Meeting Notes Summarizer - Setup Script
# This script helps you set up the development environment

echo "🤖 AI Meeting Notes Summarizer - Setup Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if ! [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB found"
else
    echo "⚠️  MongoDB not found. You can:"
    echo "   - Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    echo "   - Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your configuration:"
    echo "   - Add your Groq API key"
    echo "   - Configure MongoDB URI"
    echo "   - Set up email credentials (optional)"
fi

cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your configuration:"
echo "   - Get Groq API key from: https://console.groq.com"
echo "   - Set MongoDB connection string"
echo "   - Configure email settings (optional)"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔗 Useful links:"
echo "   - Groq Console: https://console.groq.com"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - Project Documentation: README.md"
echo ""
echo "Happy summarizing! 🚀"
