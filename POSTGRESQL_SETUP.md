# SOLUCIÓN DE PROBLEMAS: Configuración PostgreSQL para EcoEventos

## 🔍 Diagnóstico del Error

El error indica que la autenticación falló para el usuario `postgres`. Esto puede deberse a:

1. **Contraseña incorrecta del usuario postgres**
2. **PostgreSQL configurado con autenticación diferente**
3. **Base de datos `eco_eventos` no existe**

## 🛠️ Soluciones Paso a Paso

### **Opción 1: Usar pgAdmin o línea de comandos**

```sql
-- Conectar como superusuario y crear la base de datos
CREATE DATABASE eco_eventos;

-- Verificar que el usuario postgres existe
SELECT usename FROM pg_user WHERE usename = 'postgres';

-- Cambiar la contraseña del usuario postgres si es necesario
ALTER USER postgres PASSWORD 'nueva_password';
```

### **Opción 2: Configuración rápida con comandos PowerShell**

```powershell
# Conectar a PostgreSQL y crear la base de datos
psql -U postgres -h localhost -c "CREATE DATABASE eco_eventos;"

# Si pide contraseña, usa la que configuraste durante la instalación
```

### **Opción 3: Usar Docker (Más fácil)**

```bash
# Detener cualquier contenedor existente
docker stop ecoevents-postgres 2>/dev/null
docker rm ecoevents-postgres 2>/dev/null

# Crear nuevo contenedor con configuración conocida
docker run --name ecoevents-postgres \
  -e POSTGRES_PASSWORD=ecoevents123 \
  -e POSTGRES_DB=eco_eventos \
  -p 5432:5432 \
  -d postgres:15

# Esperar unos segundos para que inicie
# Luego usar esta URL en .env:
# DATABASE_URL="postgresql://postgres:ecoevents123@localhost:5432/eco_eventos"
```

### **Opción 4: Usar Base de Datos en la Nube (Recomendado)**

#### **Supabase (Gratis y fácil):**

1. Ve a <https://supabase.com>
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Ve a Settings → Database
5. Copia la Connection String
6. Úsala en tu archivo .env

#### **Railway (Alternativa):**

1. Ve a <https://railway.app>
2. Conecta con GitHub
3. Despliega PostgreSQL
4. Copia la URL de conexión

## 🔧 Configuración Recomendada

**Para desarrollo local con Docker:**
env
DATABASE_URL="postgresql://postgres:ecoevents123@localhost:5432/eco_eventos"

**Para producción con Supabase:**
env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

## ⚡ Próximos Pasos

1. **Elige una opción** de las de arriba
2. **Actualiza el archivo .env** con la URL correcta
3. **Ejecuta:** `npx prisma db push`
4. **Ejecuta:** `npx prisma db seed` (si tienes script de seed)
5. **Inicia el servidor:** `npm run dev`

## 📞 Si Sigues Teniendo Problemas

Dime cuál opción prefieres y te ayudo a configurarla paso a paso:

- ¿Docker?
- ¿Supabase?
- ¿Instalación local?
