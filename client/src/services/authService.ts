// Base URL del API - usando servidor debug temporalmente
const API_BASE_URL = 'http://localhost:4001/api';

// Interfaces para autenticación
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ORGANIZER' | 'ADMIN';
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

// Función para hacer llamadas a la API con mejor manejo de errores
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

    try {
        console.log(`🔄 Realizando ${options.method || 'GET'} a ${url}`);
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✅ Respuesta exitosa');
        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            // Error de conectividad
            const connectivityError = new Error(
                'No se pudo conectar con el servidor. Verifica que:\n' +
                '1. El servidor backend esté ejecutándose en http://localhost:4000\n' +
                '2. No haya problemas de CORS\n' +
                '3. El firewall no esté bloqueando la conexión'
            );
            console.error('❌ Error de conectividad:', connectivityError.message);
            throw connectivityError;
        }
        
        console.error('❌ Error en API:', error);
        throw error;
    }
};

// Función para login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    return data;
};

// Función para registro
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
    return data;
};


// Función para verificar conectividad con el servidor
export const checkServerConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
        });
        return response.ok || response.status === 404; // 404 es OK si el endpoint base no existe
    } catch {
        return false;
    }
}

// Función para obtener perfil
export const getProfile = async (): Promise<User> => {
    const data = await apiCall('/auth/profile');
    return data;
};

// Función para logout
export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Verificar si el token no ha expirado
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

// Función para obtener el usuario actual
export const getCurrentUser = (): User | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            return JSON.parse(userString);
        } catch {
            return null;
        }
    }
    return null;
};

// Función para obtener el token
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};
