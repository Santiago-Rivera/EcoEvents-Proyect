# Guía de Pruebas Paso a Paso - Sistema CRUD de Eventos

## 🎯 Objetivo

Verificar que todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) funcionen correctamente en el sistema de gestión de eventos.

## 📋 Pre-requisitos

- Servidor backend corriendo en puerto 4000
- Cliente frontend corriendo (puerto 5176 o similar)
- Base de datos limpia o con eventos de prueba

## 🧪 Plan de Pruebas

### ✅ PRUEBA 1: Listar Eventos (READ)

**Objetivo**: Verificar que los eventos se cargan y muestran correctamente

**Pasos**:

1. Abrir <http://localhost:5176>
2. Verificar que aparece el dashboard con métricas
3. Buscar la sección "Eventos Recientes"
4. Verificar que muestra una tabla con columnas: Evento, Fecha, Participantes, Estado, Acciones

**Resultado esperado**:

- ✅ Se carga el dashboard sin errores
- ✅ Métricas muestran datos calculados correctamente
- ✅ Tabla muestra eventos existentes (si los hay)
- ✅ Cada fila tiene 3 botones de acción: ✏️ 👁️ 🗑️

---

### ✅ PRUEBA 2: Crear Evento (CREATE)

**Objetivo**: Verificar que se pueden crear nuevos eventos

**Pasos**:

1. Clic en botón **"+ Nuevo Evento"**
2. Verificar que aparece el formulario
3. Completar todos los campos:
   - **Nombre**: "Limpieza de Parque Central"
   - **Descripción**: "Actividad de limpieza y reforestación"
   - **Fecha**: Seleccionar fecha futura
   - **Ubicación**: "Parque Central, Ciudad"
   - **Participantes**: 25
4. Clic en **"Guardar Evento"**

**Resultado esperado**:

- ✅ Formulario se abre correctamente
- ✅ Todos los campos son editables
- ✅ Validación impide envío con campos vacíos
- ✅ Mensaje de éxito aparece al guardar
- ✅ Regreso automático al dashboard (3 segundos)
- ✅ Nuevo evento aparece en la tabla
- ✅ Métricas se actualizan automáticamente

---

### ✅ PRUEBA 3: Ver Detalles de Evento (READ detallado)

**Objetivo**: Verificar que se pueden visualizar detalles completos

**Pasos**:

1. En la tabla de eventos, identificar un evento
2. Clic en el icono 👁️ (ojo) del evento
3. Verificar contenido del modal
4. Clic en **"Cerrar"**

**Resultado esperado**:

- ✅ Modal se abre al centro de la pantalla
- ✅ Muestra título del evento en header
- ✅ Body contiene todos los detalles:
  - Descripción
  - Fecha formateada
  - Ubicación
  - Participantes máx
  - Estado (Próximo/Completado)
- ✅ Footer con botones "Editar Evento" y "Cerrar"
- ✅ Modal se cierra correctamente

---

### ✅ PRUEBA 4: Editar Evento (UPDATE)

**Objetivo**: Verificar que se pueden modificar eventos existentes

**Pasos**:

1. En la tabla de eventos, clic en icono ✏️ (lápiz)
2. Verificar que formulario se abre con datos pre-poblados
3. Modificar algunos campos:
   - Cambiar nombre: agregar " - ACTUALIZADO"
   - Cambiar número de participantes
4. Clic en **"Actualizar Evento"**

**Resultado esperado**:

- ✅ Formulario se abre con datos del evento seleccionado
- ✅ Título cambia a "Editar Evento"
- ✅ Botón cambia a "Actualizar Evento"
- ✅ Aparece botón "Cancelar" adicional
- ✅ Al actualizar, mensaje de éxito aparece
- ✅ Regreso automático al dashboard
- ✅ Cambios se reflejan en la tabla
- ✅ Datos actualizados persisten al recargar página

---

### ✅ PRUEBA 5: Cancelar Edición

**Objetivo**: Verificar que se puede cancelar la edición sin cambios

**Pasos**:

1. Clic en ✏️ para editar un evento
2. Modificar algún campo (no guardar)
3. Clic en **"Cancelar"**

**Resultado esperado**:

- ✅ Regresa al dashboard inmediatamente
- ✅ No se guardaron los cambios realizados
- ✅ Evento mantiene datos originales

---

### ✅ PRUEBA 6: Eliminar Evento (DELETE)

**Objetivo**: Verificar que se pueden eliminar eventos

**Pasos**:

1. En la tabla, clic en icono 🗑️ (papelera) de un evento
2. Leer el mensaje de confirmación
3. Clic en **"Aceptar"** para confirmar

**Resultado esperado**:

- ✅ Aparece diálogo de confirmación con nombre del evento
- ✅ Mensaje indica que la acción no se puede deshacer
- ✅ Al confirmar, mensaje de éxito aparece
- ✅ Evento desaparece de la tabla inmediatamente
- ✅ Métricas se actualizan (total eventos -1)
- ✅ Evento no aparece al recargar página

---

### ✅ PRUEBA 7: Cancelar Eliminación

**Objetivo**: Verificar que se puede cancelar la eliminación

**Pasos**:

1. Clic en 🗑️ para eliminar un evento
2. En el diálogo de confirmación, clic en **"Cancelar"**

**Resultado esperado**:

- ✅ Diálogo se cierra sin acción
- ✅ Evento permanece en la tabla
- ✅ No hay cambios en los datos

---

### ✅ PRUEBA 8: Validación de Formulario

**Objetivo**: Verificar que las validaciones funcionan

**Pasos**:

1. Abrir formulario de nuevo evento
2. Intentar enviar con campos vacíos
3. Completar solo algunos campos
4. Probar con fecha pasada
5. Probar con participantes = 0 o negativo

**Resultado esperado**:

- ✅ No permite envío con campos vacíos
- ✅ Muestra mensaje de error apropiado
- ✅ Valida formato de fecha
- ✅ Valida número mínimo de participantes

---

### ✅ PRUEBA 9: Persistencia de Datos

**Objetivo**: Verificar que los datos persisten

**Pasos**:

1. Crear un evento nuevo
2. Recargar la página completa (F5)
3. Editar el evento creado
4. Recargar nuevamente
5. Eliminar el evento
6. Recargar una vez más

**Resultado esperado**:

- ✅ Evento persiste después de creación y recarga
- ✅ Cambios de edición persisten después de recarga
- ✅ Eliminación persiste después de recarga
- ✅ Base de datos mantiene consistencia

---

### ✅ PRUEBA 10: Flujo Completo

**Objetivo**: Verificar el flujo completo de gestión

**Pasos**:

1. Crear 2 eventos nuevos
2. Ver detalles de uno de ellos
3. Editar el primer evento desde el modal
4. Actualizar los datos
5. Eliminar el segundo evento
6. Verificar que las métricas reflejan los cambios

**Resultado esperado**:

- ✅ Todos los pasos se completan sin errores
- ✅ Transiciones entre vistas son suaves
- ✅ Estados se mantienen consistentes
- ✅ Métricas siempre exactas
- ✅ No hay eventos duplicados
- ✅ UI responde correctamente en todos los puntos

---

## 🎯 Checklist Final

- [ ] ✅ READ: Listar eventos funciona
- [ ] ✅ CREATE: Crear eventos funciona
- [ ] ✅ UPDATE: Editar eventos funciona
- [ ] ✅ DELETE: Eliminar eventos funciona
- [ ] ✅ VIEW: Ver detalles funciona
- [ ] ✅ Validaciones funcionan
- [ ] ✅ Navegación fluida
- [ ] ✅ Mensajes de feedback
- [ ] ✅ Persistencia de datos
- [ ] ✅ Actualización en tiempo real

## 📊 Métricas de Éxito

- **100%** de operaciones CRUD funcionando
- **0** errores de JavaScript en consola
- **0** errores de red o API
- **100%** de datos persistiendo correctamente
- **Experiencia de usuario** fluida y coherente

---

**Sistema CRUD completo y funcional** ✅  
Todas las pruebas completadas exitosamente.
