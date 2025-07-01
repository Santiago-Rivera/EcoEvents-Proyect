// Base URL del API
const API_BASE_URL = 'http://localhost:4000/api';

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

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
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
