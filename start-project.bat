@echo off
echo.
echo ===============================================
echo    🌱 EcoEvents Project - Iniciando Servicios
echo ===============================================
echo.

echo [1/4] Verificando configuracion...
if not exist "server\.env" (
    echo ❌ Archivo .env no encontrado en server/
    echo Creando archivo .env con configuracion por defecto...
    echo DATABASE_URL="file:./dev.db" > server\.env
    echo JWT_SECRET="your-super-secret-jwt-key-change-in-production" >> server\.env
    echo PORT=4000 >> server\.env
    echo ✅ Archivo .env creado
)

echo [2/4] Generando cliente de Prisma...
cd server
call npx prisma generate --schema=src/prisma/schema.prisma
if errorlevel 1 (
    echo ❌ Error generando cliente de Prisma
    pause
    exit /b 1
)
echo ✅ Cliente de Prisma generado
cd ..

echo [3/4] Iniciando Backend Server (Puerto 4000)...
start "🟢 Backend Server - EcoEvents" cmd /k "cd /d server && echo Iniciando servidor backend... && npm run dev"

echo [4/4] Esperando 5 segundos antes de iniciar el frontend...
timeout /t 5 /nobreak >nul

echo [4/4] Iniciando Frontend Client (Puerto 5173)...
start "🎨 Frontend Client - EcoEvents" cmd /k "cd /d client && echo Iniciando cliente frontend... && npm run dev"

echo.
echo ===============================================
echo ✅ Servicios iniciados correctamente!
echo ===============================================
echo.
echo 📊 URLs disponibles:
echo    • Backend API: http://localhost:4000
echo    • Frontend:    http://localhost:5173
echo    • Test Auth:   Abrir test-auth.html en navegador
echo.
echo 🧪 Para probar la API:
echo    • Abrir test-auth.html en tu navegador
echo    • O ejecutar: node test-auth-api.js
echo.
echo 💡 Endpoints de autenticacion:
echo    • POST /api/auth/register
echo    • POST /api/auth/login
echo    • GET  /api/auth/profile
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo 🚀 Abriendo aplicacion en el navegador...
echo.
pause
