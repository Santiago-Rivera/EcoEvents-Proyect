import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

// Registrar usuario
export const register = async (req, res) => {
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

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Registro - Usuario ya existe:', email);
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    console.log('✅ Registro - Usuario no existe, procediendo...');

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Registro - Contraseña hasheada');

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('✅ Registro - Usuario creado:', user.email);

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Registro - Token generado para:', user.email);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
            registrations: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};