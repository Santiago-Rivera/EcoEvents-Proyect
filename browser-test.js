// Prueba de conectividad directa
console.log('🔍 Iniciando pruebas de conectividad...');

// Prueba 1: Verificar que el servidor responde
fetch('http://localhost:4000/')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Prueba 1 - Servidor principal:', data);
  })
  .catch(error => {
    console.error('❌ Prueba 1 - Error servidor principal:', error);
  });

// Prueba 2: Verificar endpoint de eventos
fetch('http://localhost:4000/api/eventos')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Prueba 2 - Endpoint eventos:', data);
  })
  .catch(error => {
    console.error('❌ Prueba 2 - Error endpoint eventos:', error);
  });

// Prueba 3: Crear evento
const testEventData = {
  nombre: "Evento Prueba Frontend",
  descripcion: "Prueba desde el navegador",
  fecha: "2025-07-02T10:00",
  ubicacion: "Browser Test",
  maxParticipantes: 15
};

fetch('http://localhost:4000/api/eventos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testEventData)
})
.then(response => {
  console.log('📊 Prueba 3 - Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Prueba 3 - Evento creado:', data);
})
.catch(error => {
  console.error('❌ Prueba 3 - Error crear evento:', error);
});

console.log('🔍 Pruebas de conectividad iniciadas. Revisa los resultados arriba.');
