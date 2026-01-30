@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║      Sistema de Gestion para Peluquerias                     ║
echo ║                                                               ║
echo ║              ¡Primer inicio del sistema!                      ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js no esta instalado
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detectado
node --version
echo.

REM Verificar dependencias
if not exist "node_modules" (
    echo Instalando dependencias del servidor...
    call npm install
    echo.
)

if not exist "client\node_modules" (
    echo Instalando dependencias del cliente...
    cd client
    call npm install
    cd ..
    echo.
)

echo Dependencias instaladas
echo.
echo Iniciando el sistema...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo.
echo   Usuario:   admin
echo   Password:  admin123
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Consejos:
echo   • El sistema incluye datos de demostracion
echo   • Puedes instalar la app en tu movil (PWA)
echo   • Lee GUIA_USUARIO.md para mas informacion
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
timeout /t 3 >nul

call npm run dev
