@echo off
color 0A
title EcoEvents - Sistema de Inicio Completo

echo.
echo ===============================================
echo     🌱 EcoEvents - Inicio Completo del Sistema
echo ===============================================
echo.

echo [PASO 1] Configurando entorno del servidor...
cd server

REM Verificar si existe .env
if not exist ".env" (
    echo 📄 Creando archivo .env...
    echo DATABASE_URL="file:./dev.db" > .env
    echo JWT_SECRET="your-super-secret-jwt-key-change-in-production" >> .env
    echo PORT=4000 >> .env
    echo ✅ Archivo .env creado
) else (
    echo ✅ Archivo .env ya existe
)

echo.
echo [PASO 2] Instalando dependencias del servidor...
call npm install
if errorlevel 1 (
    echo ❌ Error instalando dependencias del servidor
    pause
    exit /b 1
)
echo ✅ Dependencias del servidor instaladas

echo.
echo [PASO 3] Configurando Prisma...
call npx prisma generate --schema=src/prisma/schema.prisma
if errorlevel 1 (
    echo ❌ Error generando cliente de Prisma
    pause
    exit /b 1
)
echo ✅ Cliente de Prisma generado

call npx prisma db push --schema=src/prisma/schema.prisma
if errorlevel 1 (
    echo ❌ Error sincronizando base de datos
    pause
    exit /b 1
)
echo ✅ Base de datos sincronizada

echo.
echo [PASO 4] Instalando dependencias del cliente...
cd ..\client
call npm install
if errorlevel 1 (
    echo ❌ Error instalando dependencias del cliente
    pause
    exit /b 1
)
echo ✅ Dependencias del cliente instaladas

echo.
echo [PASO 5] Iniciando servidores...
echo 🔄 Iniciando servidor backend...
cd ..\server
start "🟢 Backend Server - EcoEvents" cmd /k "echo Servidor Backend - Puerto 4000 && echo. && npm run dev"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🔄 Iniciando cliente frontend...
cd ..\client
start "🎨 Frontend Client - EcoEvents" cmd /k "echo Cliente Frontend - Puerto 5173 && echo. && npm run dev"

echo.
echo [PASO 6] Verificando conectividad...
timeout /t 3 /nobreak >nul

cd ..
node test-auth-complete.js

echo.
echo ===============================================
echo ✅ SISTEMA INICIADO CORRECTAMENTE
echo ===============================================
echo.
echo 🌐 URLs disponibles:
echo    • Frontend:    http://localhost:5173
echo    • Backend API: http://localhost:4000
echo    • API Auth:    http://localhost:4000/api/auth
echo.
echo 📋 Funcionalidades listas:
echo    • ✅ Registro de usuarios
echo    • ✅ Inicio de sesión
echo    • ✅ Autenticación JWT
echo    • ✅ Rutas protegidas
echo.
echo 🧪 Para probar:
echo    1. Abre http://localhost:5173
echo    2. Registra un nuevo usuario
echo    3. Inicia sesión con las credenciales
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo 🚀 Abriendo aplicación en el navegador...
echo.
pause
