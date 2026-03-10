@echo off
echo 🏥 Checking STACK Kids Bank API health...

REM Wait a moment for the application to start
timeout /t 5 /nobreak >nul

REM Check if application is responding using PowerShell
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 10; if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) { Write-Host '✅ Application is healthy (HTTP' $response.StatusCode ')'; Write-Host '🔗 API is running at: http://localhost:8080'; Write-Host ''; Write-Host '📊 PM2 Status:'; exit 0 } else { Write-Host '❌ Application returned HTTP' $response.StatusCode; exit 1 } } catch { Write-Host '❌ Application is not responding'; Write-Host '📋 Checking logs...'; exit 1 }"

if %errorlevel% equ 0 (
    pm2 list | findstr kidsbank-api
) else (
    echo 📋 Checking logs...
    pm2 logs kidsbank-api --lines 10
    
    echo.
    echo 🔄 Attempting to restart application...
    pm2 restart kidsbank-api
    
    echo ⏳ Waiting for restart...
    timeout /t 10 /nobreak >nul
    
    REM Check again after restart
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 10; if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) { Write-Host '✅ Application recovered after restart'; exit 0 } else { Write-Host '❌ Application still not responding after restart'; exit 1 } } catch { Write-Host '❌ Application still not responding after restart'; exit 1 }"
)

pause