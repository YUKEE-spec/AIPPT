@echo off
echo ========================================
echo   🎯 TYQ Customized Health Check 🎯
echo ========================================
echo.

echo 检查后端服务 (http://localhost:5000/health)...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务正常运行
    curl -s http://localhost:5000/health
    echo.
) else (
    echo ❌ 后端服务未运行或无法访问
    echo 请确保后端服务已启动在端口 5000
)

echo.
echo 检查前端服务 (http://localhost:3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务正常运行
) else (
    echo ❌ 前端服务未运行或无法访问
    echo 请确保前端服务已启动在端口 3000
)

echo.
echo 检查环境配置...
if exist ".env" (
    echo ✅ .env 配置文件存在
) else (
    echo ❌ .env 配置文件不存在
)

if exist "backend\instance\database.db" (
    echo ✅ 数据库文件存在
) else (
    echo ⚠️  数据库文件不存在（首次启动时会自动创建）
)

if exist "uploads" (
    echo ✅ 上传目录存在
) else (
    echo ⚠️  上传目录不存在（首次启动时会自动创建）
)

echo.
echo ========================================
echo 检查完成！
echo ========================================
pause