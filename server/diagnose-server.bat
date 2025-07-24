@echo off
echo.
echo ===============================================
echo    🔧 EcoEvents - Diagnóstico de Conectividad
echo ===============================================
echo.

echo [1/5] Verificando puertos disponibles...
netstat -an | findstr :4000
if errorlevel 1 (
    echo ❌ Puerto 4000 no está en uso
) else (
    echo ✅ Puerto 4000 está en uso
)

netstat -an | findstr :3000
if errorlevel 1 (
    echo ❌ Puerto 3000 no está en uso
) else (
    echo ✅ Puerto 3000 está en uso
)

echo.
echo [2/5] Intentando conectar al servidor backend...
curl -s http://localhost:4000 >nul 2>&1
if errorlevel 1 (
    echo ❌ No se puede conectar a http://localhost:4000
) else (
    echo ✅ Conexión exitosa a http://localhost:4000
)

curl -s http://localhost:4000/api >nul 2>&1
if errorlevel 1 (
    echo ❌ No se puede conectar a http://localhost:4000/api
) else (
    echo ✅ Conexión exitosa a http://localhost:4000/api
)

echo.
echo [3/5] Verificando archivos de configuración...
if exist ".env" (
    echo ✅ Archivo .env encontrado
    type .env
) else (
    echo ❌ Archivo .env no encontrado
)

echo.
echo [4/5] Intentando iniciar el servidor...
echo Ejecutando: npm run dev
start "Backend Debug" cmd /k "npm run dev"

echo.
echo [5/5] Esperando 3 segundos y probando conectividad...
timeout /t 3 /nobreak >nul

curl -s http://localhost:4000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Servidor aún no responde
    echo.
    echo 💡 Soluciones recomendadas:
    echo 1. Verificar que todas las dependencias estén instaladas: npm install
    echo 2. Generar cliente de Prisma: npm run prisma:generate
    echo 3. Sincronizar base de datos: npm run prisma:push
    echo 4. Verificar configuración del puerto en .env
    echo 5. Revisar logs del servidor en la ventana que se abrió
) else (
    echo ✅ ¡Servidor respondiendo correctamente!
    echo.
    echo 🎉 El servidor está funcionando en http://localhost:4000
    echo 📊 API disponible en http://localhost:4000/api
)

echo.
echo ===============================================
pause
