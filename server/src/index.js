import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import prisma from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// Configurar variables de entorno
config();

// Inicializar app
const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'], // Vite en diferentes puertos
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de EcoEventos funcionando correctamente' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Conectar a la base de datos y arrancar el servidor
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Probar conexión a la base de datos
    await prisma.$connect();
    console.log('🟢 Conexión a SQLite establecida con Prisma.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌐 Frontend en http://localhost:5173`);
      console.log(`📊 API endpoints disponibles:`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   - GET  http://localhost:${PORT}/api/auth/profile`);
    });
  } catch (error) {
    console.error('🔴 Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

// Manejo limpio de cierre
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();