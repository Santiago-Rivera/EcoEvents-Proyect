// Script de prueba para verificar la API de autenticación
const API_BASE_URL = 'http://localhost:4000/api';

// Función para hacer llamadas a la API
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        console.log(`🔄 Realizando ${options.method || 'GET'} a ${url}`);
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        console.log('✅ Respuesta exitosa:', data);
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
};

// Función para probar registro
const testRegister = async () => {
    console.log('\n=== PROBANDO REGISTRO ===');
    const userData = {
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        password: 'password123',
        role: 'USER'
    };

    try {
        const result = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        console.log('🎉 Registro exitoso!');
        return result;
    } catch (error) {
        console.error('💥 Error en registro:', error.message);
        return null;
    }
};

// Función para probar login
const testLogin = async () => {
    console.log('\n=== PROBANDO LOGIN ===');
    const credentials = {
        email: 'test@example.com',
        password: 'password123'
    };

    try {
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        console.log('🎉 Login exitoso!');
        return result;
    } catch (error) {
        console.error('💥 Error en login:', error.message);
        return null;
    }
};

// Función para probar estado del servidor
const testServerStatus = async () => {
    console.log('\n=== PROBANDO ESTADO DEL SERVIDOR ===');
    try {
        const result = await apiCall('');
        console.log('🎉 Servidor funcionando correctamente!');
        return result;
    } catch (error) {
        console.error('💥 Servidor no responde:', error.message);
        return null;
    }
};

// Ejecutar todas las pruebas
const runAllTests = async () => {
    console.log('🚀 Iniciando pruebas de la API...\n');
    
    // Probar estado del servidor
    await testServerStatus();
    
    // Esperar un poco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Probar registro
    const registerResult = await testRegister();
    
    // Esperar un poco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Probar login
    const loginResult = await testLogin();
    
    console.log('\n✅ Pruebas completadas!');
};

// Ejecutar si está en Node.js
if (typeof window === 'undefined') {
    runAllTests();
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.runAuthTests = runAllTests;
    window.testRegister = testRegister;
    window.testLogin = testLogin;
    window.testServerStatus = testServerStatus;
    
    console.log('📋 Funciones disponibles en consola:');
    console.log('- window.runAuthTests() - Ejecutar todas las pruebas');
    console.log('- window.testRegister() - Probar registro');
    console.log('- window.testLogin() - Probar login'); 
    console.log('- window.testServerStatus() - Probar estado del servidor');
}
