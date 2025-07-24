// Debug script para probar la base de datos directamente
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function testDatabase() {
    console.log('🔍 Probando conexión a la base de datos...');
    
    try {
        // Test 1: Conectar
        await prisma.$connect();
        console.log('✅ Conexión a la base de datos exitosa');
        
        // Test 2: Verificar si la tabla users existe
        const users = await prisma.user.findMany();
        console.log(`✅ Tabla users accesible. Usuarios existentes: ${users.length}`);
        
        // Test 3: Crear un usuario de prueba
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User Debug',
                email: 'debug' + Date.now() + '@example.com',
                password: 'hashedpassword123',
                role: 'USER'
            }
        });
        console.log('✅ Usuario de prueba creado:', testUser.name);
        
        // Test 4: Limpiar usuario de prueba
        await prisma.user.delete({
            where: { id: testUser.id }
        });
        console.log('✅ Usuario de prueba eliminado');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
        console.log('🔌 Desconectado de la base de datos');
    }
}

testDatabase();
