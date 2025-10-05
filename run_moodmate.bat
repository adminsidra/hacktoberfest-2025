@echo off
echo 🤖 Starting MoodMate AI Web App...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python 3.7+ first.
    pause
    exit /b 1
)

REM Install dependencies if not already installed
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Run the app
echo.
echo 🚀 Starting Flask application...
echo Open your browser and go to: http://127.0.0.1:5000
echo.
python app.py

pause
