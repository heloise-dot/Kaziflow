@echo off
echo ==========================================
echo    KaziFlow Full Stack Setup Script
echo ==========================================

echo [1/4] Installing Python Dependencies...
python -m pip install fastapi uvicorn sqlmodel asyncpg greenlet google-genai python-multipart python-jose[cryptography] passlib[bcrypt] pydantic-settings aiosqlite
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b %errorlevel%
)

echo [2/4] Initializing Database...
rem No explicit init script needed as main.py does it on startup, 
rem but we ensure the directory structure is readable.

echo [3/4] Cleaning and Installing Frontend...
if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules
)
call npm install
call npm install vite --save-dev
call npm install axios --save

echo [4/4] Starting Services...
echo.
echo Please run the following command in a NEW terminal for Frontend:
echo    npm run dev
echo.
echo Starting Backend in THIS terminal...
python start_backend.py
pause
