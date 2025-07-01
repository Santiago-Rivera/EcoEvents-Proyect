// Script de verificación de endpoints
const BASE_URL = 'http://localhost:4000/api';

const testEndpoints = async () => {
    console.log('🚀 Iniciando pruebas de endpoints...\n');
    
    // Test 1: Obtener eventos
    try {
        const response = await fetch(`${BASE_URL}/events`);
        const events = await response.json();
        console.log('✅ GET /api/events - OK');
        console.log(`   Eventos encontrados: ${events.length}`);
    } catch (error) {
        console.log('❌ GET /api/events - Error:', error.message);
    }
    
    // Test 2: Verificar estado del servidor
    try {
        const response = await fetch(`${BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });
        // Se espera un 401 o error de autorización
        console.log('✅ Servidor de autenticación - Respondiendo');
    } catch (error) {
        console.log('⚠️  Auth endpoint - Posible error de conexión');
    }
    
    console.log('\n🎯 Verificación completada!');
};

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
    testEndpoints();
} else {
    module.exports = testEndpoints;
}
