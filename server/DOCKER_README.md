# EcoEvents Server - Docker

Este directorio contiene la configuración de Docker para el servidor de EcoEvents.

## 🐳 Archivos Docker

- `Dockerfile`: Configuración multi-stage para desarrollo y producción
- `docker-compose.yml`: Orquestación de servicios
- `.dockerignore`: Archivos excluidos del contexto de build

## 🚀 Uso Rápido

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar en producción
docker-compose up --build

# Para desarrollo con hot-reload
docker-compose --profile dev up --build ecoevents-dev
```

### Opción 2: Docker directo

```bash
# Construir la imagen
docker build -t ecoevents-server .

# Ejecutar el contenedor
docker run -p 3000:3000 -v ecoevents_data:/app/data ecoevents-server
```

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Ejecutar en modo desarrollo
docker-compose --profile dev up ecoevents-dev

# Ver logs en tiempo real
docker-compose logs -f ecoevents-server

# Acceder al contenedor
docker-compose exec ecoevents-server sh
```

### Producción

```bash
# Construir para producción
docker build --target production -t ecoevents-server:prod .

# Ejecutar en producción
docker-compose up -d
```

### Gestión de Base de Datos

```bash
# Ejecutar migraciones de Prisma
docker-compose exec ecoevents-server npx prisma db push

# Abrir Prisma Studio
docker-compose exec ecoevents-server npx prisma studio

# Ver la base de datos SQLite
docker-compose exec ecoevents-server sqlite3 /app/data/dev.db
```

## 🔧 Configuración

### Variables de Entorno

El contenedor acepta las siguientes variables de entorno:

- `NODE_ENV`: Entorno de ejecución (development/production)
- `DATABASE_URL`: URL de la base de datos SQLite
- `PORT`: Puerto del servidor (por defecto: 3000)

### Volúmenes

- `ecoevents_data`: Persiste la base de datos SQLite
- `ecoevents_dev_data`: Base de datos para desarrollo

### Puertos

- `3000`: API de producción
- `3001`: API de desarrollo (solo con perfil dev)

## 🏥 Health Check

El contenedor incluye un health check que verifica:

- Respuesta HTTP en el endpoint `/api/health`
- Estado del servidor Node.js
- Conectividad de la base de datos

## 📊 Monitoreo

```bash
# Ver estado de salud
docker-compose ps

# Ver métricas del contenedor
docker stats ecoevents-api

# Ver logs con filtros
docker-compose logs --tail=100 ecoevents-server
```

## 🔒 Seguridad

- Ejecuta con usuario no-root (`ecoevents`)
- Imagen Alpine Linux minimalista
- Solo expone puertos necesarios
- Archivos sensibles excluidos con `.dockerignore`

## 🐛 Troubleshooting

### Problemas Comunes

1. **Base de datos no se crea**

   ```bash
   docker-compose exec ecoevents-server npx prisma db push --accept-data-loss
   ```

2. **Permisos de archivos**

   ```bash
   docker-compose down
   docker volume rm server_ecoevents_data
   docker-compose up --build
   ```

3. **Puerto ocupado**

   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3001:3000"  # En lugar de 3000:3000
   ```

### Logs Detallados

```bash
# Ver todos los logs
docker-compose logs --timestamps

# Solo errores
docker-compose logs | grep ERROR

# Logs específicos del servicio
docker-compose logs ecoevents-server
```
