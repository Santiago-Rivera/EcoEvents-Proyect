// Mock de eventos para desarrollo temporal
const eventosStorage = [
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

// Función para simular llamadas a la API sin servidor
export const mockApiCall = async (endpoint: string, options: RequestInit = {}) => {
    console.log('🧪 Mock API Call a:', endpoint, 'con opciones:', options);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (endpoint === '/eventos' && (!options.method || options.method === 'GET')) {
        return eventosStorage;
    }
    
    if (endpoint === '/eventos' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const nuevoEvento = {
            id: eventosStorage.length + 1,
            title: body.nombre,
            description: body.descripcion,
            date: body.fecha,
            location: body.ubicacion,
            maxParticipants: body.maxParticipantes || 50,
            createdBy: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            creator: {
                id: 1,
                name: "Usuario Demo",
                email: "demo@example.com"
            },
            _count: {
                registrations: 0
            }
        };
        
        eventosStorage.push(nuevoEvento);
        
        return {
            message: 'Evento creado exitosamente (modo mock)',
            evento: nuevoEvento
        };
    }
    
    if (endpoint.startsWith('/eventos/')) {
        const id = parseInt(endpoint.split('/')[2]);
        const evento = eventosStorage.find(e => e.id === id);
        if (!evento) {
            throw new Error('Evento no encontrado');
        }
        return evento;
    }
    
    throw new Error('Endpoint no soportado en modo mock');
};
