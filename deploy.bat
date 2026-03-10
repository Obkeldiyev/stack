@echo off
echo 🚀 Deploying STACK Kids Bank API...

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Build the application
echo 📦 Building application...
cd stack
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
cd ..

REM Check if JAR file exists
if not exist "stack\target\kidsbank-api-1.0.0.jar" (
    echo ❌ JAR file not found!
    pause
    exit /b 1
)

REM Stop existing PM2 process
echo 🛑 Stopping existing process...
pm2 stop kidsbank-api 2>nul
pm2 delete kidsbank-api 2>nul

REM Start with PM2
echo ▶️ Starting with PM2...
pm2 start ecosystem.config.js --env production

if %errorlevel% equ 0 (
    echo ✅ Application started successfully!
    
    REM Save PM2 configuration
    pm2 save
    
    echo.
    echo 📊 Application Status:
    pm2 list
    
    echo.
    echo 🔗 Application should be available at: http://localhost:8080
    echo 📋 View logs: pm2 logs kidsbank-api
    echo 📊 Monitor: pm2 monit
    echo 🔄 Restart: pm2 restart kidsbank-api
    echo.
    echo ✅ Deployment complete!
) else (
    echo ❌ Failed to start application!
    pause
    exit /b 1
)

pause