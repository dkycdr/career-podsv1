@echo off
REM Quick Setup Script untuk AI Chatbot
REM Author: AI Assistant
REM Date: Nov 30, 2025

echo.
echo ========================================
echo   AI Chatbot - Quick Setup
echo ========================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo [1/3] Creating .env.local...
    (
        echo # DeepSeek API - Get from https://api.deepseek.com
        echo DEEPSEEK_API_KEY=sk_paste_your_api_key_here
        echo.
        echo # Database (existing setup)
        echo # DATABASE_URL=your_postgresql_url
    ) > .env.local
    echo ✓ Created .env.local
    echo.
    echo NEXT STEP: 
    echo   1. Go to https://api.deepseek.com
    echo   2. Sign up and copy your API key
    echo   3. Open .env.local and replace sk_paste_your_api_key_here
    echo.
) else (
    echo ✓ .env.local already exists
)

echo [2/3] Checking dependencies...
call npm list > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Dependencies installed
) else (
    echo Installing dependencies...
    call npm install
)

echo.
echo [3/3] Ready to start!
echo.
echo Run this command to start dev server:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Happy chatting with AI!
pause
