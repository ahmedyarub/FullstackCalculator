@echo off
REM Start both backend and frontend.
REM Usage: scripts\start-all.bat
REM
REM Note: This starts the backend in a separate window.

echo ============================================
echo   Fullstack Calculator — Starting All
echo ============================================
echo.
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo.
echo ============================================

REM Start backend in a new window
start "Calculator Backend" cmd /c "%~dp0start-backend.bat"

REM Start frontend in this window
call "%~dp0start-frontend.bat"
