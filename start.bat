@echo off
title CSGO Demo Watcher

git fetch --all
git reset --hard origin/HEAD
call npm ci --only=prod
cls
call node .
