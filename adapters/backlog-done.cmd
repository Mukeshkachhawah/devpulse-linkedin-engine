@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0backlog-done.ps1" %*
