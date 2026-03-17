@echo off
REM Docker Compose Tester - Quick Start Script for Windows

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Docker Compose Tester - Quick Start
echo ==========================================
echo.

REM Verificar se Docker está instalado
echo [1/3] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo X Docker nao encontrado. Por favor, instale Docker Desktop.
    pause
    exit /b 1
)
echo OK Docker encontrado

REM Verificar se Docker Compose está instalado
echo [2/3] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo X Docker Compose nao encontrado.
    pause
    exit /b 1
)
echo OK Docker Compose encontrado

REM Iniciar containers
echo [3/3] Iniciando containers...
echo.
docker-compose up --build

echo.
echo ==========================================
echo OK Servicos iniciados com sucesso!
echo ==========================================
echo.
echo Acesse:
echo   - Tester:  http://localhost:3000
echo   - Apache:  http://localhost:8080
echo   - Nginx:   http://localhost:8081
echo.
echo Pressione Ctrl+C para parar os containers
echo.
pause
