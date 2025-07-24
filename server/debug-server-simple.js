const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Simulador de base de datos en memoria para eventos
let eventos = [
  {
    id: 1,
    title: "Limpieza de Playa Sostenible",
    description: "Evento de limpieza comunitaria en la playa con enfoque en sostenibilidad",
    date: "2025-08-15T10:00:00.000Z",
    location: "Playa Central, Ciudad de México",
    maxParticipants: 50,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: {
      id: 1,
      name: "Usuario Demo",
      email: "demo@example.com"
    },
    _count: {
      registrations: 15
    }
  }
];

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

// GET /api/eventos - Obtener todos los eventos
app.get('/api/eventos', (req, res) => {
  console.log('📄 Obteniendo todos los eventos...');
  res.json(eventos);
});

// GET /api/eventos/:id - Obtener evento por ID
app.get('/api/eventos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find(e => e.id === id);
  
  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }
  
  res.json(evento);
});

// POST /api/eventos - Crear nuevo evento
app.post('/api/eventos', authenticateToken, (req, res) => {
  try {
    console.log('📝 Creando evento - Datos recibidos:', req.body);
    
    const { nombre, descripcion, fecha, ubicacion, maxParticipantes } = req.body;
    
    // Validaciones básicas
    if (!nombre || !descripcion || !fecha || !ubicacion) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos (nombre, descripcion, fecha, ubicacion)' 
      });
    }

    // Crear nuevo evento
    const nuevoEvento = {
      id: eventos.length + 1,
      title: nombre,
      description: descripcion,
      date: fecha,
      location: ubicacion,
      maxParticipants: maxParticipantes || 50,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        id: req.user.userId,
        name: "Usuario Demo",
        email: req.user.email
      },
      _count: {
        registrations: 0
      }
    };

    eventos.push(nuevoEvento);
    
    console.log('✅ Evento creado exitosamente:', nuevoEvento.title);
    
    res.status(201).json({
      message: 'Evento creado exitosamente (modo debug)',
      evento: nuevoEvento
    });

  } catch (error) {
    console.error('❌ Error creando evento:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      details: error.message 
    });
  }
});

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor DEBUG corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - GET  http://localhost:${PORT}/api/eventos`);
  console.log(`   - GET  http://localhost:${PORT}/api/eventos/:id`);
  console.log(`   - POST http://localhost:${PORT}/api/eventos`);
});
