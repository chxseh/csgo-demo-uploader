@echo off
title CSGO Demo Uploader

echo Updating...
echo.
git fetch --all >nul
git reset --hard origin/HEAD >nul
call npm ci --only=prod >nul
cls
call node .
