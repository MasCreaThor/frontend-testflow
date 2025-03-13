// src/services/profile.service.ts
import axios from 'axios';
import { UserProfile, UpdateProfileRequest } from '@/types/auth.types';

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

export const ProfileService = {
  /**
   * Obtiene el perfil del usuario por ID de usuario
   */
  getProfileByUserId: async (userId: string): Promise<UserProfile> => {
    try {
      const response = await api.get(`/people/user/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al obtener el perfil');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile: async (profileId: string, data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      const response = await api.put(`/people/${profileId}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al actualizar el perfil');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Sube una imagen de perfil
   */
  uploadProfileImage: async (profileId: string, file: File): Promise<{ profileImage: string }> => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await api.post(`/uploads/profile/${profileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al subir la imagen de perfil');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  /**
   * Elimina la imagen de perfil
   */
  deleteProfileImage: async (profileId: string): Promise<void> => {
    try {
      await api.delete(`/uploads/profile/${profileId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al eliminar la imagen de perfil');
      }
      throw new Error('Error al conectar con el servidor');
    }
  }
};