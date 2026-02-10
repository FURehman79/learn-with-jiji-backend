#!/bin/bash

# Learn with Jiji - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Learn with Jiji Backend - Setup Script"
echo "=========================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. You have: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your Supabase credentials!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build complete"
echo ""

# Setup complete
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Run the database migration in Supabase SQL Editor"
echo "3. Start the server with: npm run dev"
echo ""
echo "📚 Documentation:"
echo "- README.md - Main documentation"
echo "- SUPABASE_SETUP.md - Supabase configuration guide"
echo "- API_TESTING.md - API testing examples"
echo ""
echo "🎉 Happy coding!"
