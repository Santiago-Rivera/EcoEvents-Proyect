# Etapa base
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl sqlite

# Etapa de dependencias
FROM base AS deps
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Etapa de desarrollo
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Etapa de construcción
FROM base AS builder
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate

# Etapa de producción
FROM base AS production

# Crear directorio para la base de datos SQLite
RUN mkdir -p /app/data

# Configurar variable de entorno para la base de datos
ENV DATABASE_URL="file:/app/data/dev.db"
ENV NODE_ENV=production

# Crear un usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ecoevents -u 1001 -G nodejs

# Copiar dependencias y código desde el builder
COPY --from=builder --chown=ecoevents:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=ecoevents:nodejs /app/package*.json ./
COPY --from=builder --chown=ecoevents:nodejs /app/prisma ./prisma
COPY --from=builder --chown=ecoevents:nodejs /app/src ./src
COPY --from=builder --chown=ecoevents:nodejs /app/seed.js ./seed.js

# Cambiar al usuario no-root
USER ecoevents

# Crear script de inicio que inicializa la base de datos si no existe
COPY --chown=ecoevents:nodejs <<EOF /app/start.sh
#!/bin/sh
set -e

echo "🚀 Iniciando EcoEvents Server..."

# Verificar si la base de datos existe, si no, crearla
if [ ! -f /app/data/dev.db ]; then
  echo "📁 Inicializando base de datos SQLite..."
  npx prisma db push --accept-data-loss
  
  # Ejecutar seeds si existe el archivo
  if [ -f /app/seed.js ]; then
    echo "🌱 Ejecutando datos de prueba..."
    node seed.js
  fi
  echo "✅ Base de datos inicializada correctamente"
else
  echo "📊 Base de datos encontrada, continuando..."
fi

# Asegurarse de que el cliente de Prisma esté actualizado
echo "🔄 Generando cliente de Prisma..."
npx prisma generate

echo "🌟 Servidor listo en puerto 3000"
exec npm start
EOF

RUN chmod +x /app/start.sh

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["/app/start.sh"]

# Configuración de healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Etiquetas de metadata
LABEL maintainer="EcoEvents Team" \
      description="EcoEvents API Server with Prisma and SQLite" \
      version="1.0.0" \
      nodejs.version="18"
