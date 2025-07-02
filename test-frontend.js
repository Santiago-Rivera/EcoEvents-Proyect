// Prueba de la API desde el navegador
// Abre las herramientas de desarrollador y ejecuta este código

async function testCreateEvent() {
    const eventData = {
        nombre: "Evento de Prueba desde Navegador",
        descripcion: "Este es un evento de prueba para debugging",
        fecha: "2025-07-01T15:00",
        ubicacion: "Lugar de Prueba",
        maxParticipantes: 25
    };

    console.log('Enviando datos:', eventData);

    try {
        const response = await fetch('http://localhost:4000/api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        console.log('Status de respuesta:', response.status);
        console.log('Headers de respuesta:', response.headers);

        const data = await response.json();
        console.log('Datos de respuesta:', data);

        if (response.ok) {
            console.log('✅ Evento creado exitosamente!');
        } else {
            console.log('❌ Error al crear evento:', data);
        }
    } catch (error) {
        console.error('❌ Error de red:', error);
    }
}

// Ejecutar la prueba
testCreateEvent();
