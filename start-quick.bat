@echo off
echo ========================================
echo   Bermuda Royal Hospitality System
echo   Starting Development Server...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking for existing processes on port 3000...
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
echo [2/4] Checking dependencies...
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
echo [3/4] Starting Next.js development server on port 3000...
start "" cmd /k "npm run dev"

echo.
echo [4/4] Waiting for server to be ready...
echo Checking if server is responding...

:check_server
timeout /t 2 /nobreak >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Server is ready!
    goto open_browser
)
echo Still waiting for server...
goto check_server

:open_browser
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
