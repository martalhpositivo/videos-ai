@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   Automarket Durango - Subtitular video
echo ============================================
echo.

REM 1) Comprobar Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [X] No encuentro Node.js.
  echo     Instalalo desde https://nodejs.org  ^(version LTS^) y vuelve a intentarlo.
  echo.
  pause
  exit /b 1
)

REM 2) Instalar dependencias la primera vez
if not exist "node_modules" (
  echo Instalando dependencias por primera vez... ^(puede tardar un par de minutos^)
  call npm install
  if errorlevel 1 ( echo [X] Fallo al instalar dependencias. & pause & exit /b 1 )
  echo.
)

REM 3) Obtener el video (arrastrado sobre el .bat, o preguntando)
set "VIDEO=%~1"
if "%VIDEO%"=="" (
  echo Arrastra tu video sobre este archivo, o pega su ruta aqui abajo.
  set /p "VIDEO=Ruta del video: "
)
if "%VIDEO%"=="" ( echo [X] No indicaste ningun video. & pause & exit /b 1 )

echo.
echo Subtitulando: "%VIDEO%"
echo ^(la primera vez se descarga Whisper; luego transcribe y renderiza^)
echo.

REM 4) Ejecutar el pipeline
call npm run subtitle -- "%VIDEO%"
if errorlevel 1 ( echo. & echo [X] Ocurrio un error. Revisa el mensaje de arriba. & pause & exit /b 1 )

echo.
echo [OK] Listo. Tienes el video subtitulado junto al original.
echo.
pause
