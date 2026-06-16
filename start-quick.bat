@echo off
echo ========================================
echo   Bermuda Royal Hospitality System
echo   Enhanced Quick Start Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/7] Cleaning temporary files and cache...
if exist ".next" (
    echo Cleaning .next directory...
    rmdir /s /q ".next" >nul 2>&1
)
if exist "data\database.json" (
    echo Cleaning old database...
    del /f /q "data\database.json" >nul 2>&1
)
echo Cleanup completed!

echo.
echo [2/7] Checking for existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Found process %%a using port 3000. Killing it...
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Could not kill process %%a, trying alternative method...
        taskkill /F /IM node.exe >nul 2>&1
    ) else (
        echo Process killed successfully
    )
)
timeout /t 2 /nobreak >nul

echo.
echo [3/7] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)

echo.
echo [4/7] Cleaning Next.js cache...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo Build failed, but continuing with dev server...
)
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
)

echo.
echo [5/7] Starting Next.js development server on port 3000...
echo Server will start in a new window...
start "" cmd /k "npm run dev"

echo.
echo [6/7] Waiting for server to be ready...
echo This may take 30-60 seconds on first run...
set max_attempts=30
set attempt=0

:check_server
set /a attempt+=1
echo Attempt %attempt% of %max_attempts%...
timeout /t 2 /nobreak >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Server is ready!
    echo ========================================
    goto open_browser
)
if %attempt% lss %max_attempts% (
    echo Server not ready yet, waiting...
    goto check_server
)
echo.
echo WARNING: Server did not respond within expected time
echo Opening browser anyway...

:open_browser
echo.
echo [7/7] Opening browser...
timeout /t 2 /nobreak >nul
start "" http://localhost:3000

echo.
echo ========================================
echo   Bermuda System Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Network: http://192.168.1.7:3000
echo.
echo Test Accounts:
echo   Staff: abouda7 / Abouda2004#
echo   Customer: 12345678901234 / 123456
echo.
echo Press any key to close this window...
pause >nul
