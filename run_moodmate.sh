#!/bin/bash
echo "🤖 Starting MoodMate AI Web App..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found! Please install Python 3.7+ first."
    exit 1
fi

# Install dependencies if not already installed
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

# Run the app
echo
echo "🚀 Starting Flask application..."
echo "Open your browser and go to: http://127.0.0.1:5000"
echo
python3 app.py
