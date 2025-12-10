@echo off
echo ========================================
echo   🔄 配置迁移工具 🔄
echo ========================================
echo.

echo 此工具帮助你将环境变量配置迁移到前端API配置
echo.

REM 检查.env文件是否存在
if not exist ".env" (
    echo ❌ 未找到.env文件
    echo 请先创建.env文件并配置API密钥
    pause
    exit /b 1
)

echo 📋 当前.env文件中的配置：
echo.
findstr "GOOGLE_API_KEY" .env 2>nul
if %errorlevel% equ 0 (
    echo ✅ 找到Google API配置
    echo.
    echo 💡 迁移建议：
    echo 1. 启动系统后，访问 http://localhost:3000
    echo 2. 点击右上角的"API配置"按钮
    echo 3. 添加Google Gemini文本和图像API
    echo 4. 将.env文件中的API密钥复制到前端配置中
    echo 5. 测试API连接确保配置正确
    echo.
    echo 🔒 安全提醒：
    echo - 前端配置仅存储在本地浏览器中
    echo - 不会上传到服务器
    echo - 可以保留.env文件作为备用配置
) else (
    echo ⚠️  未找到Google API配置
    echo 请在.env文件中添加：
    echo GOOGLE_API_KEY=your-api-key-here
)

echo.
echo ========================================
echo 迁移完成后的优势：
echo ========================================
echo ✨ 支持多种AI服务商
echo ✨ 可视化配置界面  
echo ✨ 实时连接测试
echo ✨ 配置导入导出
echo ✨ 智能配置验证
echo.
pause