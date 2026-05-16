@echo off
title Bermuda - Starting Servers...
color 0A

echo.
echo  =============================================
echo    BERMUDA - Starting All Servers
echo  =============================================
echo.

:: Start Laravel Backend in a new window
echo  [1/2] Starting Laravel Backend (Port 8000)...
start "Bermuda - Laravel Backend" cmd /k "cd /d "%~dp0laravel-backend" && php artisan serve --host=127.0.0.1 --port=8000"

:: Wait 2 seconds then start Next.js Frontend
timeout /t 2 /nobreak >nul

echo  [2/2] Starting Next.js Frontend (Port 9002)...
start "Bermuda - Next.js Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

:: Wait for frontend to start then open browser
echo.
echo  Waiting for servers to start...
timeout /t 8 /nobreak >nul

echo  Opening browser...
start "" "http://localhost:9002"

echo.
echo  Both servers are running!
echo  - Frontend: http://localhost:9002
echo  - Backend:  http://127.0.0.1:8000
echo.
echo  Close this window at any time.
pause
