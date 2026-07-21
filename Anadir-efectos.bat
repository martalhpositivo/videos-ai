@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   Automarket Durango - Anadir efectos 3D
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [X] No encuentro Node.js.
  echo     Instalalo desde https://nodejs.org  ^(version LTS^) y vuelve a intentarlo.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias por primera vez... ^(puede tardar un par de minutos^)
  call npm install
  if errorlevel 1 ( echo [X] Fallo al instalar dependencias. & pause & exit /b 1 )
  echo.
)

set "VIDEO=%~1"
if "%VIDEO%"=="" (
  echo Arrastra tu video sobre este archivo, o pega su ruta aqui abajo.
  set /p "VIDEO=Ruta del video: "
)
if "%VIDEO%"=="" ( echo [X] No indicaste ningun video. & pause & exit /b 1 )

echo.
echo Anadiendo intro 3D, rotulos y stickers a: "%VIDEO%"
echo.

call npm run fx -- "%VIDEO%"
if errorlevel 1 ( echo. & echo [X] Ocurrio un error. Revisa el mensaje de arriba. & pause & exit /b 1 )

echo.
echo [OK] Listo. Tienes el video con efectos junto al original ^(..-fx.mp4^).
echo.
pause
