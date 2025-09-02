@echo off
echo Building Hotel Booking Widget...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build widget
echo Building widget...
call npm run build

REM Check if build was successful
if exist "dist\widget.js" (
    echo.
    echo ✅ Build successful!
    echo.
    echo Files created:
    dir dist\widget.*
    echo.
    echo Widget is ready for deployment.
    echo.
    echo To test the widget, run:
    echo   npm run serve
    echo   Then open http://localhost:8080
) else (
    echo.
    echo ❌ Build failed!
    echo Please check the error messages above.
)

pause
