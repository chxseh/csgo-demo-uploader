@echo off
title CSGO Demo Uploader

git fetch --all
git reset --hard origin/HEAD
call npm ci --only=prod
cls
call node .
