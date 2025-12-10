@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   TYQ Customized - One Click Startup
echo ========================================
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/6] Checking environment...
echo.

REM Check Python
py --version >nul 2>&1
if %errorlevel% neq 0 (
    python --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Python not installed or not in PATH
        echo Please install Python 3.10+ and try again
        pause
        exit /b 1
    )
)
echo [OK] Python installed

REM Check uv
uv --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] uv package manager not installed
    echo Please visit https://docs.astral.sh/uv/getting-started/installation/
    pause
    exit /b 1
)
echo [OK] uv package manager installed

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not installed or not in PATH
    echo Please install Node.js 16+ and try again
    pause
    exit /b 1
)
echo [OK] Node.js installed

echo.
echo [2/6] Creating directories...
if not exist "backend\instance" mkdir "backend\instance"
if not exist "uploads" mkdir "uploads"
echo [OK] Directories ready

echo.
echo [3/6] Installing backend dependencies...
uv sync --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Backend dependencies installation failed
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

echo.
echo [4/6] Installing frontend dependencies...
cd frontend
call npm install --silent 2>nul
if %errorlevel% neq 0 (
    echo [WARN] npm install had warnings, continuing...
)
cd ..
echo [OK] Frontend dependencies installed

echo.
echo [5/6] Starting backend service (port 5000)...
start "TYQ-Backend" /min cmd /c "cd /d "%SCRIPT_DIR%backend" && uv run python app.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

REM Check if backend started
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Backend health check pending, continuing...
)

echo.
echo [6/6] Starting frontend service (port 3000)...
start "TYQ-Frontend" /min cmd /c "cd /d "%SCRIPT_DIR%frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Startup Complete!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo   Two terminal windows are running in background.
echo   Close them to stop the services.
echo.
echo ========================================

REM Auto open browser
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to close this window...
echo (Services will continue running)
pause >nul
