@echo off
echo ========================================
echo   Bermuda Royal Hospitality System
echo   Starting Development Server...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking for existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Found process %%a using port 3000. Killing it...
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Could not kill process %%a
    ) else (
        echo Process killed successfully
    )
)

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Starting Next.js development server on port 3000...
echo Please wait while the server starts...
echo.

start "" cmd /k "npm run dev"

echo.
echo Waiting for server to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Opening browser...
echo ========================================
start "" http://localhost:3000

echo.
echo SUCCESS! Bermuda is now running
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
