@echo off
title BoogerBoys Web Server
echo Checking for Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found! Starting local web server...
    start "" "http://localhost:8000/alex/WoahItsMyReallyCoolSiteThatYouShouldStayOnForAReallyReallyLongTimeFromJustHowAwesomeItIs.html"
    python -m http.server 8000
    goto end
)

echo Checking for Node.js / npx...
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js found! Starting local web server via npx...
    start "" "http://localhost:8000/alex/WoahItsMyReallyCoolSiteThatYouShouldStayOnForAReallyReallyLongTimeFromJustHowAwesomeItIs.html"
    npx http-server -p 8000
    goto end
)

echo.
echo ================================================================
echo ERROR: Neither Python nor Node.js could be detected on your system.
echo.
echo To run the high-precision audio visualizer, browsers require
echo the site to be served from a local server due to security (CORS)
echo restrictions when opening raw "file:///" links.
echo.
echo Please install Python (https://www.python.org/) or Node.js
echo and run this file again to enable the real audio visualizer!
echo ================================================================
pause

:end
