// Base URL del API
const API_BASE_URL = 'http://localhost:4000/api';

// Interfaz para el tipo Evento (actualizada para PostgreSQL)
export interface Evento {
    id: number;
    title: string;
    description?: string;
    date: string;
    location?: string;
    maxParticipants?: number;
    createdBy: number;
    createdAt?: string;
    updatedAt?: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
    _count?: {
        registrations: number;
    };
}

// Interfaz para los datos del formulario (frontend)
export interface EventoFormData {
    nombre: string;
    descripcion: string;
    fecha: string;
    ubicacion: string;
    maxParticipantes?: number;
}

// Interfaz para los datos del participante
export interface ParticipanteData {
    nombre: string;
    email: string;
    telefono: string;
    comentarios?: string;
    recibirNotificaciones: boolean;
}

// Interfaz para los datos completos de participación
export interface ParticiparEventoData {
    eventoId: number;
    eventoTitulo: string;
    eventoFecha: string;
    eventoUbicacion: string;
    participante: ParticipanteData;
}

// Función para hacer llamadas a la API
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    console.log('Haciendo petición a:', url);
    console.log('Con configuración:', config);

    const response = await fetch(url, config);
    console.log('Respuesta recibida:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Datos de la respuesta:', data);

    if (!response.ok) {
        console.error('Error en la respuesta:', response.status, data);
        throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
};

// Función para obtener todos los eventos
export const getEventos = async (): Promise<Evento[]> => {
    const data = await apiCall('/eventos');
    return data;
};

// Función para obtener un evento por ID
export const getEventoById = async (id: number): Promise<Evento> => {
    const data = await apiCall(`/eventos/${id}`);
    return data;
};

// Función para crear un nuevo evento
export const createEvento = async (eventoData: EventoFormData): Promise<Evento> => {
    console.log('Enviando datos del evento:', eventoData); // Para debugging
    
    // Convertir la fecha del formato datetime-local a ISO string si es necesario
    const formattedData = {
        ...eventoData,
        fecha: eventoData.fecha.includes('T') && !eventoData.fecha.includes('Z') 
            ? `${eventoData.fecha}:00.000Z`  // Agregar segundos y timezone si no están
            : eventoData.fecha
    };
    
    console.log('Datos formateados para envío:', formattedData);
    
    const data = await apiCall('/eventos', {
        method: 'POST',
        body: JSON.stringify(formattedData),
    });
    
    console.log('Evento creado exitosamente:', data); // Para debugging
    
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('eventoCreado', { 
        detail: data.evento 
    }));
    
    return data.evento;
};

// Función para actualizar un evento
export const updateEvento = async (id: number, eventoData: Partial<EventoFormData>): Promise<Evento> => {
    const data = await apiCall(`/eventos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventoData),
    });
    return data.evento;
};

// Función para eliminar un evento
export const deleteEvento = async (id: number): Promise<void> => {
    await apiCall(`/eventos/${id}`, {
        method: 'DELETE',
    });
};

// Función para registrarse a un evento
export const registrarseEvento = async (id: number): Promise<void> => {
    await apiCall(`/eventos/${id}/register`, {
        method: 'POST',
    });
};

// Función para cancelar registro de un evento
export const cancelarRegistro = async (id: number): Promise<void> => {
    await apiCall(`/eventos/${id}/register`, {
        method: 'DELETE',
    });
};

// Función para participar en un evento (sin autenticación)
export const participarEnEvento = async (data: ParticiparEventoData): Promise<{ 
    message: string;
    registro: {
        id: number;
        participante: {
            nombre: string;
            email: string;
        };
        evento: {
            id: number;
            titulo: string;
            fecha: string;
        };
    };
    correoEnviado: boolean;
    messageId?: string;
}> => {
    console.log('Enviando participación:', data);
    
    const response = await fetch(`${API_BASE_URL}/eventos/participar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    console.log('Respuesta de participación:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('Resultado de participación:', result);
    
    if (!response.ok) {
        console.error('Error en participación:', response.status, result);
        throw new Error(result.message || 'Error al registrar participación');
    }
    
    return result;
};
