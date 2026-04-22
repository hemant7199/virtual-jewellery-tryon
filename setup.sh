#!/bin/bash
# GLIMMR Quick Setup Script
set -e

echo "🌟 GLIMMR — AR Jewellery Try-On Setup"
echo "======================================="

# Copy env files
echo "📋 Setting up environment files..."
[ ! -f backend/.env ] && cp backend/.env.example backend/.env && echo "  ✅ backend/.env created"
[ ! -f frontend/.env ] && cp frontend/.env.example frontend/.env && echo "  ✅ frontend/.env created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd backend  && npm install && cd ..
echo "  ✅ All dependencies installed"

# Seed database
echo "🌱 Seeding database..."
cd dataset && node seed.js && cd ..

echo ""
echo "✅ Setup complete! Run: npm run dev"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API docs: http://localhost:5000/api/health"
