@echo off
cd /d "%~dp0"
echo Preparing new Glisten website images...
python tools\optimize_images.py
if errorlevel 1 py tools\optimize_images.py
pause
