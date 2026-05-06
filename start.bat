@echo off
chcp 65001 >nul
echo ===== Hexo Deploy Start =====

cd /d E:\项目管理\Blog\Hexo-blog\blog

echo.
echo Generating...
call hexo g

if errorlevel 1 (
    echo ❌ hexo g 失败
    pause
    exit /b
)

echo.
echo Deploying...
call hexo d

if errorlevel 1 (
    echo ❌ hexo d 失败
    pause
    exit /b
)

echo.
echo ✅ 部署完成！
pause