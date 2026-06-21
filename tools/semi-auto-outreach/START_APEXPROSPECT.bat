@echo off
title ApexProspect Server
color 0C
cd /d "%~dp0"

echo ========================================
echo   APEXPROSPECT - Starting Server
echo ========================================
echo.

if not exist "node_modules" (
    echo Installing dependencies first time...
    call npm install
    echo.
)

echo Starting server on http://localhost:3777
echo.
echo Browser will open automatically in 3 seconds...
echo Press CTRL+C in this window to STOP the server.
echo.

start "" /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3777"

call npm start

pause
