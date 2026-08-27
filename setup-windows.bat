@echo off
echo =========================================
echo Gold App - Windows/Laragon Setup Script
echo =========================================
echo.

REM Check if running in Laragon directory
if not exist "C:\laragon" (
    echo [WARNING] Laragon not found at C:\laragon
    echo This script is optimized for Laragon
    echo.
)

echo [Step 1/8] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

echo [Step 2/8] Checking PHP...
php --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PHP not found in PATH
    echo Please make sure Laragon is running or add PHP to PATH
    pause
    exit /b 1
)
php --version | findstr /C:"PHP"
echo.

echo [Step 3/8] Checking MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MySQL command not found in PATH
    echo Make sure MySQL is running in Laragon
    echo.
) else (
    mysql --version
    echo.
)

echo [Step 4/8] Checking Tesseract OCR...
tesseract --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Tesseract OCR not found
    echo.
    echo Please install Tesseract OCR:
    echo 1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
    echo 2. Install to: C:\Program Files\Tesseract-OCR\
    echo 3. Add to PATH or update api/config/config.php
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    tesseract --version | findstr /C:"tesseract"
    echo.
)

echo [Step 5/8] Installing Frontend Dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed
)
echo.

echo [Step 6/8] Setting up Environment Files...
if not exist ".env.local" (
    if exist "env.local" (
        echo Copying env.local to .env.local...
        copy env.local .env.local >nul
        echo Created .env.local with Laragon configuration
    ) else (
        echo Creating .env.local...
        echo # Local Development Environment Variables > .env.local
        echo NEXT_PUBLIC_API_URL=http://gold.test/api >> .env.local
        echo NODE_ENV=development >> .env.local
        echo Created .env.local
    )
) else (
    echo .env.local already exists
)
echo.

echo [Step 7/8] Setting up Backend (PHP + MySQL)...
cd api
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    
    REM Try different template files in order of preference
    if exist "DOT_ENV_READY" (
        copy DOT_ENV_READY .env >nul
        echo Created api/.env from DOT_ENV_READY template
    ) else if exist "dot-env" (
        copy dot-env .env >nul
        echo Created api/.env from dot-env template
    ) else if exist "env" (
        copy env .env >nul
        echo Created api/.env from env template
    ) else (
        echo [ERROR] No .env template found!
        echo Please create api/.env manually or ensure DOT_ENV_READY exists
        echo.
    )
) else (
    echo .env file already exists
)
echo.

echo Running database migration...
php migrate.php
if errorlevel 1 (
    echo [ERROR] Database migration failed
    echo.
    echo Please check:
    echo 1. MySQL is running in Laragon
    echo 2. Database credentials in api/config/database.php
    echo 3. Database 'gold_prices' exists or can be created
    echo.
    cd ..
    pause
    exit /b 1
)
echo.

echo Testing price fetch...
php fetch_prices.php
if errorlevel 1 (
    echo [WARNING] Price fetch test failed
    echo This might be due to:
    echo 1. Tesseract OCR not installed
    echo 2. Internet connection issues
    echo 3. Website structure changed
    echo.
    echo You can continue and fix this later
    echo.
)
cd ..
echo.

echo [Step 8/8] Configuring Laragon Virtual Host...
echo.
echo To access the app at http://gold.test:
echo.
echo 1. Open Laragon
echo 2. Right-click on Laragon tray icon
echo 3. Go to: Apache ^> sites-enabled
echo 4. Make sure this project is listed
echo 5. Restart Laragon if needed
echo.
echo Or manually add to hosts file:
echo    C:\Windows\System32\drivers\etc\hosts
echo    Add line: 127.0.0.1 gold.test
echo.

echo =========================================
echo Setup Completed!
echo =========================================
echo.
echo Frontend:
echo   - URL: http://localhost:3000 (dev server)
echo   - URL: http://gold.test:3000 (Laragon)
echo   - Start: npm run dev
echo.
echo Backend API:
echo   - URL: http://gold.test/api
echo   - URL: http://localhost/gold/api
echo   - Test: http://gold.test/api/prices
echo.
echo Database:
echo   - Name: gold_prices
echo   - Tables: karats, current_prices, price_history, fetch_logs
echo.
echo Cron Job Setup:
echo   1. Open Task Scheduler
echo   2. Create Basic Task
echo   3. Trigger: Daily, repeat every 1 minute
echo   4. Action: Start a program
echo      Program: C:\laragon\bin\php\php-8.x.x\php.exe
echo      Arguments: %CD%\api\cron.php
echo.
echo Next Steps:
echo   1. Start frontend: npm run dev
echo   2. Open: http://localhost:3000
echo   3. Setup cron job for automatic price updates
echo   4. Check logs in: logs/ directory
echo.
echo Documentation:
echo   - README.md - Complete user guide
echo   - QUICKSTART.md - Quick start guide
echo   - api/README.md - Backend documentation
echo   - BACKEND_SUMMARY.md - Backend summary
echo.
pause
