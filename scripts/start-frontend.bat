@echo off
REM Start the React frontend dev server.
REM Usage: scripts\start-frontend.bat

echo ==> Starting frontend dev server...
cd /d "%~dp0..\frontend"

REM Install dependencies if needed
if not exist "node_modules" (
  echo ==> Installing dependencies...
  npm install
)

npm run dev
