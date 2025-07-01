# EcoEventos - Aplicación Full Stack

Una plataforma para gestionar eventos ecológicos y sostenibles.

## 🚀 Inicio Rápido

### Backend

```bash
cd server
npm install
npm run prisma:generate
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 📋 Configuración de Base de Datos

1. Instala PostgreSQL
2. Crea la base de datos `eco_eventos`
3. Actualiza el `.env` en `/server` con tus credenciales
4. Ejecuta `npm run prisma:push` desde `/server`

## 🌐 URLs

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000](http://localhost:4000)
- API Docs: [http://localhost:4000/api](http://localhost:4000/api)

## ✨ Funcionalidades

- ✅ Autenticación JWT
- ✅ CRUD de eventos
- ✅ Registro a eventos
- ✅ Dashboard de organizador
- ✅ Interfaz responsive
- ✅ TypeScript en frontend y backend

## 🧭 Navegación de la Aplicación

### Páginas Disponibles

La aplicación cuenta con las siguientes páginas principales que puedes acceder desde el **Navbar**:

#### 🏠 **Inicio** (`/`)

- Página de bienvenida con información sobre EcoEventos
- Características principales de la plataforma
- Botones de acceso rápido a eventos y registro

#### 🎯 **Eventos** (`/eventos`)

- Lista completa de eventos ecológicos disponibles
- Filtros y búsqueda de eventos
- Detalles de cada evento con opción de registro

#### 📊 **Dashboard** (`/dashboard`)

- Panel de control para organizadores
- Gestión de eventos creados
- Estadísticas y métricas de participación

#### ℹ️ **Acerca de** (`/about`)

- Información sobre la misión y visión de EcoEventos
- Objetivos de la plataforma
- Cómo funciona el sistema

#### 📞 **Contacto** (`/contact`)

- Formulario de contacto
- Información de contacto del equipo
- Canales de comunicación disponibles

#### 🔐 **Autenticación**

- **Iniciar Sesión** (`/login`): Acceso para usuarios registrados
- **Registrarse** (`/register`): Crear nueva cuenta de usuario

### 🎮 Cómo Navegar

1. **Usar el Navbar**: Todos los enlaces en la barra de navegación superior te llevarán a las páginas correspondientes
2. **Enlaces directos**: Puedes acceder directamente escribiendo la URL en el navegador
3. **Botones de acción**: En la página de inicio hay botones que te dirigen a eventos y registro
4. **Navegación responsive**: La interfaz se adapta a dispositivos móviles y escritorio

### 🔄 Estados de la Aplicación

- **Sin autenticar**: Acceso a todas las páginas públicas (Inicio, Eventos, Acerca de, Contacto, Login, Register)
- **Autenticado**: Acceso completo incluyendo Dashboard y funciones de gestión de eventos
