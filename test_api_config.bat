@echo off
echo ========================================
echo   🧪 API配置功能测试脚本 🧪
echo ========================================
echo.

echo 测试后端API配置接口...
echo.

REM 测试获取可用提供商
echo 1. 测试获取可用API提供商...
curl -s http://localhost:5000/api/config/providers
echo.
echo.

REM 测试配置验证
echo 2. 测试API配置验证...
curl -s -X POST http://localhost:5000/api/config/validate ^
  -H "Content-Type: application/json" ^
  -d "{\"provider\":\"google\",\"config\":{\"api_key\":\"test-key\"},\"is_image\":false}"
echo.
echo.

echo 测试完成！
echo.
echo 如果看到JSON响应，说明后端API配置接口工作正常。
echo 现在可以在前端界面中配置API了。
echo.
pause