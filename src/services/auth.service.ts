// src/services/auth.service.ts
import axios from 'axios';
import { 
  AuthResponse, 
  ResetPasswordRequest, 
  ResetPasswordResponse, 
  SetNewPasswordRequest, 
  SetNewPasswordResponse,
  RegisterRequest
} from '@/types/auth.types';

// Configuración base para axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones que lo requieran
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const AuthService = {
  /**
   * Registra un nuevo usuario
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      
      // Guardar tokens en localStorage
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al registrar usuario');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Solicita un correo para restablecer la contraseña
   */
  requestPasswordReset: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
      const response = await api.post('/auth/request-password-reset', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al solicitar restablecimiento de contraseña');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Establece una nueva contraseña con el token proporcionado
   */
  resetPassword: async (data: SetNewPasswordRequest): Promise<SetNewPasswordResponse> => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al restablecer la contraseña');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Inicia sesión con email y contraseña
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Guardar tokens en localStorage
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Credenciales inválidas');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};