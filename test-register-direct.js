// Test directo del endpoint de registro
const testRegisterEndpoint = async () => {
    console.log('🧪 Probando endpoint de registro...');
    
    const testUser = {
        name: 'Test User Direct',
        email: 'direct' + Date.now() + '@example.com',
        password: 'password123'
    };
    
    try {
        console.log('📤 Enviando datos:', testUser);
        
        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });
        
        console.log('📥 Status:', response.status);
        console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('📥 Response body (raw):', responseText);
        
        try {
            const responseJson = JSON.parse(responseText);
            console.log('📥 Response body (parsed):', responseJson);
        } catch (parseError) {
            console.log('❌ No se pudo parsear como JSON');
        }
        
        if (response.ok) {
            console.log('✅ Registro exitoso!');
        } else {
            console.log('❌ Registro falló');
        }
        
    } catch (error) {
        console.log('❌ Error de red:', error.message);
    }
};

testRegisterEndpoint();
