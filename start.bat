@echo off
echo ========================================
echo   Bermuda Royal Hospitality System
echo   Starting Development Server...
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Next.js development server on port 9002...
start "" http://localhost:9002
start "" cmd /k "npm run dev"

echo.
echo [3/3] Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   SUCCESS! Bermuda is now running
echo   Frontend: http://localhost:9002
echo   Backend:  http://localhost:8000 (run separately)
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
