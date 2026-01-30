@echo off
echo Instalando Sistema de Gestion de Peluqueria...
echo.

REM Verificar que Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detectado
node --version
echo.

REM Instalar dependencias del servidor
echo Instalando dependencias del servidor...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error al instalar dependencias del servidor
    pause
    exit /b 1
)
echo Dependencias del servidor instaladas
echo.

REM Instalar dependencias del cliente
echo Instalando dependencias del cliente...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error al instalar dependencias del cliente
    pause
    exit /b 1
)
cd ..
echo Dependencias del cliente instaladas
echo.

echo Instalacion completada!
echo.
echo Para iniciar la aplicacion ejecuta:
echo   npm run dev
echo.
echo Usuarios de prueba:
echo   Admin: admin / admin123
echo   Empleado: empleado1 / empleado123
echo.
pause
