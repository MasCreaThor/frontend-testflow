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

// Interfaces
export interface AdminStats {
  users: number;
  documents: number;
  quizzes: number;
  roles: number;
}

export interface CategoryData {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyGoalData {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  categoryId?: string;
  category?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateStudyGoalDto {
  name: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;
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
  },

  /**
   * Obtiene listado de categorías
   */
  getCategories: async (): Promise<CategoryData[]> => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw new Error('No se pudieron obtener las categorías');
    }
  },

  /**
   * Obtiene detalles de una categoría
   */
  getCategoryById: async (categoryId: string): Promise<CategoryData> => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw new Error('No se pudo obtener la categoría');
    }
  },

  /**
   * Crea una nueva categoría
   */
  createCategory: async (categoryData: CreateCategoryDto): Promise<CategoryData> => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw new Error('No se pudo crear la categoría');
    }
  },

  /**
   * Actualiza una categoría existente
   */
  updateCategory: async (categoryId: string, categoryData: Partial<CreateCategoryDto>): Promise<CategoryData> => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  },

  /**
   * Elimina una categoría
   */
  deleteCategory: async (categoryId: string): Promise<void> => {
    try {
      await api.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw new Error('No se pudo eliminar la categoría');
    }
  },

  /**
   * Obtiene listado de objetivos de estudio
   */
  getStudyGoals: async (): Promise<StudyGoalData[]> => {
    try {
      const response = await api.get('/study-goals');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo objetivos de estudio:', error);
      throw new Error('No se pudieron obtener los objetivos de estudio');
    }
  },

  /**
   * Obtiene objetivos de estudio por categoría
   */
  getStudyGoalsByCategory: async (categoryId: string): Promise<StudyGoalData[]> => {
    try {
      const response = await api.get(`/study-goals/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo objetivos por categoría:', error);
      throw new Error('No se pudieron obtener los objetivos de la categoría');
    }
  },

  /**
   * Obtiene detalles de un objetivo de estudio
   */
  getStudyGoalById: async (goalId: string): Promise<StudyGoalData> => {
    try {
      const response = await api.get(`/study-goals/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo objetivo de estudio:', error);
      throw new Error('No se pudo obtener el objetivo de estudio');
    }
  },

  /**
   * Crea un nuevo objetivo de estudio
   */
  createStudyGoal: async (goalData: CreateStudyGoalDto): Promise<StudyGoalData> => {
    try {
      const response = await api.post('/study-goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Error creando objetivo de estudio:', error);
      throw new Error('No se pudo crear el objetivo de estudio');
    }
  },

  /**
   * Actualiza un objetivo de estudio existente
   */
  updateStudyGoal: async (goalId: string, goalData: Partial<CreateStudyGoalDto>): Promise<StudyGoalData> => {
    try {
      const response = await api.put(`/study-goals/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando objetivo de estudio:', error);
      throw new Error('No se pudo actualizar el objetivo de estudio');
    }
  },

  /**
   * Elimina un objetivo de estudio
   */
  deleteStudyGoal: async (goalId: string): Promise<void> => {
    try {
      await api.delete(`/study-goals/${goalId}`);
    } catch (error) {
      console.error('Error eliminando objetivo de estudio:', error);
      throw new Error('No se pudo eliminar el objetivo de estudio');
    }
  }
};