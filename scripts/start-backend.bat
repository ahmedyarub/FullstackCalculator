@echo off
REM Start the Go backend server.
REM Usage: scripts\start-backend.bat

echo ==> Starting backend server...
cd /d "%~dp0..\backend"

go run ./cmd/server
