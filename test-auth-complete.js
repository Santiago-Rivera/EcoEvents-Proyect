// Script de prueba simple para el backend
const testBackend = async () => {
    console.log('🧪 Iniciando pruebas del backend...\n');

    const baseUrl = 'http://localhost:4000';
    
    // Test 1: Verificar que el servidor responde
    console.log('1️⃣ Probando conectividad básica...');
    try {
        const response = await fetch(`${baseUrl}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Servidor responde correctamente:', data.message);
        } else {
            console.log('⚠️ Servidor responde pero con error:', response.status);
        }
    } catch (error) {
        console.log('❌ No se puede conectar al servidor:', error.message);
        return;
    }

    // Test 2: Probar registro
    console.log('\n2️⃣ Probando registro de usuario...');
    const testUser = {
        name: 'Usuario Test ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        role: 'USER'
    };

    try {
        const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            console.log('✅ Registro exitoso para:', testUser.email);
            console.log('   Token recibido:', registerData.token ? 'Sí' : 'No');
            
            // Test 3: Probar login con el usuario recién registrado
            console.log('\n3️⃣ Probando login...');
            const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login exitoso para:', testUser.email);
                console.log('   Token recibido:', loginData.token ? 'Sí' : 'No');
                
                // Test 4: Probar endpoint protegido (perfil)
                console.log('\n4️⃣ Probando endpoint protegido (perfil)...');
                const profileResponse = await fetch(`${baseUrl}/api/auth/profile`, {
                    headers: { 
                        'Authorization': `Bearer ${loginData.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    console.log('✅ Perfil obtenido correctamente:', profileData.name);
                } else {
                    console.log('❌ Error obteniendo perfil:', profileResponse.status);
                }
            } else {
                const loginError = await loginResponse.json();
                console.log('❌ Error en login:', loginError.message);
            }
        } else {
            const registerError = await registerResponse.json();
            console.log('❌ Error en registro:', registerError.message);
        }
    } catch (error) {
        console.log('❌ Error durante las pruebas:', error.message);
    }

    console.log('\n🏁 Pruebas completadas!');
};

// Ejecutar las pruebas
testBackend();
