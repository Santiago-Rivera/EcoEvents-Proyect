import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Configurar variables de entorno
config();

// Inicializar app
const app = express();

// Middlewares básicos
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Endpoint de prueba básico
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de debug funcionando' });
});

// Endpoint de registro simplificado (sin Prisma)
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registro - Datos recibidos:', req.body);
    const { name, email, password, role = 'USER' } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      console.log('❌ Registro - Validación fallida: campos faltantes');
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos (name, email, password)' 
      });
    }

    if (password.length < 6) {
      console.log('❌ Registro - Validación fallida: contraseña muy corta');
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    console.log('✅ Registro - Validaciones básicas pasadas');

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Registro - Contraseña hasheada');

    // Simular usuario creado (sin base de datos)
    const user = {
        id: Date.now(),
        name,
        email,
        role,
        createdAt: new Date()
    };

    console.log('✅ Registro - Usuario simulado:', user.email);

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Registro - Token generado para:', user.email);

    res.status(201).json({
      message: 'Usuario registrado exitosamente (modo debug)',
      token,
      user
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      details: error.message
    });
  }
});

// Endpoint de login simplificado
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login - Datos recibidos:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Simular login exitoso
    const user = {
        id: 1,
        name: 'Usuario Demo',
        email,
        role: 'USER',
        createdAt: new Date()
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso (modo debug)',
      token,
      user
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      details: error.message 
    });
  }
});

const PORT = 4001; // Puerto diferente para evitar conflictos

app.listen(PORT, () => {
  console.log(`🚀 Servidor DEBUG corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
});
