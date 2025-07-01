# Guía de Pruebas - Creación de Eventos

## Estado Actual ✅

- ✅ Backend corriendo en puerto 4000
- ✅ Frontend corriendo en puerto 5173
- ✅ Base de datos SQLite configurada y funcionando
- ✅ Usuario de prueba creado en la base de datos
- ✅ API de eventos funciona correctamente
- ✅ Controlador corregido para manejar datos en español

## Instrucciones para Probar el Flujo Completo

### Paso 1: Verificar que los servidores estén corriendo

```bash
# Backend (ya está corriendo)
cd "C:\Users\The Tribal Chief\Downloads\EcoEvents-Proyect\server"
npm run dev

# Frontend (ya está corriendo)
cd "C:\Users\The Tribal Chief\Downloads\EcoEvents-Proyect\client"
npm run dev
```

### Paso 2: Acceder al Dashboard

1. Abre tu navegador web
2. Ve a: `http://localhost:5173/dashboard`
3. Verás el Panel de Control del Organizador

### Paso 3: Crear un Nuevo Evento

1. En el dashboard, haz clic en el botón "**+ Nuevo Evento**"
2. Llena el formulario con los siguientes datos de ejemplo:
   - **Nombre**: "Reforestación Urbana"
   - **Descripción**: "Plantaremos árboles en el parque central para mejorar la calidad del aire"
   - **Fecha**: Selecciona una fecha futura (ej: 15/07/2025)
   - **Ubicación**: "Parque Central, Ciudad"
   - **Máximo Participantes**: 30

3. Haz clic en "**Guardar Evento**"

### Paso 4: Verificar que el Evento se Creó

1. Deberías ver un mensaje de confirmación: "¡Evento 'Reforestación Urbana' creado exitosamente!"
2. El formulario se cerrará automáticamente después de 3 segundos
3. En el dashboard, deberías ver las métricas actualizadas

### Paso 5: Verificar en la Página de Eventos

1. Navega a: `http://localhost:5173/eventos`
2. Deberías ver tu evento recién creado listado
3. El evento debería mostrar toda la información correctamente

## Pruebas Adicionales

### Verificar API directamente (opcional)

```bash
# Ver todos los eventos
curl -X GET http://localhost:4000/api/eventos

# Crear evento vía API
curl -X POST http://localhost:4000/api/eventos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Limpieza de Playa",
    "descripcion": "Actividad de limpieza y concientización ambiental",
    "fecha": "2025-08-20T09:00:00.000Z",
    "ubicacion": "Playa Norte",
    "maxParticipantes": 25
  }'
```

## Solución de Problemas

### Si el evento no se guarda

1. **Revisa la consola del navegador** (F12 → Console)
   - Busca errores de red o JavaScript
2. **Revisa la consola del servidor**
   - Deberías ver los logs: "Datos recibidos en backend: ..."
3. **Verifica la conectividad**:

   ```bash
   curl -X GET http://localhost:4000/
   ```

   Debería devolver: `{"message":"API de EcoEventos funcionando correctamente"}`

### Si no aparece en la página de eventos

1. **Fuerza un refresh** de la página de eventos
2. **Verifica que el evento se guardó** consultando la API:

   ```bash
   curl -X GET http://localhost:4000/api/eventos
   ```

## Estado de Debugging Activo

- ✅ Logs activados en frontend (`eventService.ts`)
- ✅ Logs activados en backend (`eventController.js`)
- ✅ Event listeners configurados para actualización automática
- ✅ Validaciones de datos implementadas

## Arquitectura del Flujo
