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

// Interceptor para depurar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Depurar respuestas exitosas
    console.log(`Respuesta exitosa de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Depurar errores
    console.error(`Error en solicitud a ${error.config?.url || 'unknown endpoint'}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

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

export interface RoleData {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserData {
  _id: string;
  email: string;
  createdAt?: string;
  lastLogin?: string;
  roles?: RoleData[];
}

export interface UserRoleData {
  _id: string;
  userId: string;
  roleId: string;
  expiresAt?: string;
  isActive?: boolean;
  grantedBy?: string;
  createdAt?: string;
  user?: {
    _id: string;
    email: string;
  };
  role?: {
    _id: string;
    name: string;
  };
}

export const adminService = {
  /**
   * Verifica si el usuario actual tiene permisos de administrador
   */
  checkAdminAccess: async (): Promise<boolean> => {
    try {
      const response = await api.get('/admin-check');
      return response.data.hasAccess;
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
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Devolver datos de respaldo en caso de error
      return {
        users: 0,
        documents: 0,
        quizzes: 0,
        roles: 0
      };
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
      console.error('Error obteniendo usuarios:', error);
      // Devolver un array vacío para que la aplicación no se rompa
      return { users: [], totalPages: 1 };
    }
  },

  /**
   * Obtiene listado de roles para administración
   */
  getRoles: async (): Promise<RoleData[]> => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return [];
    }
  },

  /**
   * Obtiene el listado de asignaciones de roles a usuarios
   */
  getUserRoles: async (): Promise<UserRoleData[]> => {
    try {
      const response = await api.get('/user-roles');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo roles de usuarios:', error);
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
      console.error('Error obteniendo permisos:', error);
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
      return [];
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
      console.log('Solicitando objetivos de estudio...');
      const response = await api.get('/study-goals');
      console.log('Respuesta de objetivos de estudio:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error detallado obteniendo objetivos de estudio:', error);
      if (axios.isAxiosError(error)) {
        // Verificar si hay un error específico del backend
        const errorMessage = error.response?.data?.message || 'Error desconocido';
        console.error('Mensaje de error del servidor:', errorMessage);
      }
      // Devolver un array vacío para evitar que la aplicación se rompa
      return [];
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