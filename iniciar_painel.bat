@echo off
chcp 65001 >nul
title Radar CAIS - Plataforma de Inteligência de Editais

echo ======================================================================
echo           RADAR CAIS - INSTITUTO CAIS DE INOVACAO E SABER
echo ======================================================================
echo.

if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    echo [INFO] Python 3.12 detectado em AppData!
    echo [INFO] Iniciando servidor oficial do Radar CAIS com suporte completo...
    "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" "%~dp0agente_editais_cais.py" --web
    goto fim
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Python detectado no sistema!
    echo [INFO] Iniciando servidor oficial do Radar CAIS com suporte completo...
    python agente_editais_cais.py --web
    goto fim
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Launcher Python (py) detectado no sistema!
    echo [INFO] Iniciando servidor oficial do Radar CAIS com suporte completo...
    py agente_editais_cais.py --web
    goto fim
)

echo [INFO] Python ainda nao esta no PATH do Windows.
echo [INFO] Iniciando servidor web nativo (PowerShell) para visualizacao imediata...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_local.ps1"

:fim
pause
