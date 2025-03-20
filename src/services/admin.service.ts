// src/services/admin.service.ts
import axios from 'axios';

// Configuración base para axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Datos de prueba para desarrollo
const mockData = {
  stats: {
    users: 43,
    documents: 128,
    quizzes: 56,
    roles: 4
  }
};

export interface AdminStats {
  users: number;
  documents: number;
  quizzes: number;
  roles: number;
}

export const adminService = {
  /**
   * Verifica si el usuario actual tiene permisos de administrador
   */
  checkAdminAccess: async (): Promise<boolean> => {
    try {
      // Para desarrollo, siempre permitimos acceso mientras implementamos la API
      return true;
      
      // Cuando la API esté lista, descomentar el siguiente código:
      // const response = await api.get('/user-roles/check-admin');
      // return response.data.hasAccess;
    } catch (error) {
      // En caso de error, asumimos que no hay acceso
      console.error('Error verificando permisos de administrador:', error);
      return false;
    }
  },

  /**
   * Obtiene estadísticas para el dashboard de administrador
   */
  getStats: async (): Promise<AdminStats> => {
    try {
      // Intentamos obtener datos reales del backend
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      // Si falla, usamos datos de prueba para desarrollo
      console.info('Usando datos de prueba para estadísticas de administrador');
      return mockData.stats;
    }
  },

  /**
   * Obtiene listado de usuarios para administración
   */
  getUsers: async (page: number = 1, limit: number = 10): Promise<any> => {
    try {
      const response = await api.get(`/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.info('Usando datos de prueba para listado de usuarios');
      // Aquí podrías implementar datos de prueba para usuarios
      return {
        users: [],
        totalPages: 0
      };
    }
  },

  /**
   * Obtiene listado de roles para administración
   */
  getRoles: async (): Promise<any> => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      console.info('Usando datos de prueba para roles');
      // Implementar datos de prueba para roles si es necesario
      return [];
    }
  },

  /**
   * Obtiene listado de permisos para administración
   */
  getPermissions: async (): Promise<any> => {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error) {
      console.info('Usando datos de prueba para permisos');
      // Implementar datos de prueba para permisos si es necesario
      return [];
    }
  },

  /**
   * Asigna un rol a un usuario
   */
  assignRole: async (userId: string, roleId: string): Promise<any> => {
    try {
      const response = await api.post('/user-roles', {
        userId,
        roleId
      });
      return response.data;
    } catch (error) {
      console.error('Error asignando rol:', error);
      throw new Error('No se pudo asignar el rol al usuario');
    }
  },

  /**
   * Elimina un rol de un usuario
   */
  removeRole: async (userId: string, roleId: string): Promise<any> => {
    try {
      const response = await api.delete(`/user-roles/user/${userId}/role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando rol:', error);
      throw new Error('No se pudo eliminar el rol del usuario');
    }
  }
};