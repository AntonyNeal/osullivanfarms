#!/bin/bash
# Installation Script for SW Website
# Run with: bash install.sh

echo "🚀 Setting up SW Website..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install API dependencies
echo "📦 Installing API dependencies..."
cd api
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install API dependencies"
    exit 1
fi
cd ..
echo "✅ API dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "✅ .env file created - please update with your values"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Initialize Husky
echo "🪝 Setting up Git hooks..."
npm run prepare
if [ $? -eq 0 ]; then
    echo "✅ Git hooks configured"
else
    echo "⚠️  Git hooks setup skipped (Git may not be initialized)"
fi
echo ""

# Summary
echo "✨ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update .env file with your configuration"
echo "  2. Run 'npm run dev' to start the frontend"
echo "  3. Run 'cd api && npm run dev' to start the API (in a separate terminal)"
echo ""
echo "📖 For more information, see README.md and DEVELOPMENT.md"
