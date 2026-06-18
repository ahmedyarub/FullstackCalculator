@echo off
REM Run all tests (backend + frontend).
REM Usage: scripts\run-tests.bat

echo ============================================
echo   Running All Tests
echo ============================================

echo.
echo ==> Backend tests...
cd /d "%~dp0..\backend"
go test ./... -v -cover
if %ERRORLEVEL% neq 0 (
  echo Backend tests FAILED!
  exit /b 1
)

echo.
echo ==> Frontend tests...
cd /d "%~dp0..\frontend"
if not exist "node_modules" (
  npm install
)
npm test
if %ERRORLEVEL% neq 0 (
  echo Frontend tests FAILED!
  exit /b 1
)

echo.
echo ============================================
echo   All tests passed!
echo ============================================
