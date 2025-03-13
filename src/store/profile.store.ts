// src/store/profile.store.ts
import { create } from 'zustand';
import { ProfileService } from '@/services/profile.service';
import { UserProfile, UpdateProfileRequest } from '@/types/auth.types';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones para obtener y actualizar perfil
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (profileId: string, data: UpdateProfileRequest) => Promise<boolean>;
  uploadProfileImage: (profileId: string, file: File) => Promise<boolean>;
  deleteProfileImage: (profileId: string) => Promise<boolean>;
  
  // Acciones para manejo del estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  // Obtener perfil
  fetchProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const profile = await ProfileService.getProfileByUserId(userId);
      set({ profile, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al obtener el perfil'
      });
    }
  },
  
  // Actualizar perfil
  updateProfile: async (profileId: string, data: UpdateProfileRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProfile = await ProfileService.updateProfile(profileId, data);
      set({ profile: updatedProfile, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar el perfil'
      });
      return false;
    }
  },
  
  // Subir imagen de perfil
  uploadProfileImage: async (profileId: string, file: File) => {
    try {
      set({ isLoading: true, error: null });
      const response = await ProfileService.uploadProfileImage(profileId, file);
      
      // Actualizar el perfil con la nueva URL de imagen
      const currentProfile = get().profile;
      if (currentProfile) {
        set({ 
          profile: { ...currentProfile, profileImage: response.profileImage },
          isLoading: false
        });
      }
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al subir la imagen de perfil'
      });
      return false;
    }
  },
  
  // Eliminar imagen de perfil
  deleteProfileImage: async (profileId: string) => {
    try {
      set({ isLoading: true, error: null });
      await ProfileService.deleteProfileImage(profileId);
      
      // Actualizar el perfil para quitar la URL de imagen
      const currentProfile = get().profile;
      if (currentProfile) {
        set({ 
          profile: { ...currentProfile, profileImage: '' },
          isLoading: false
        });
      }
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar la imagen de perfil'
      });
      return false;
    }
  },
  
  // Utilidades para manejo de estado
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}));

export default useProfileStore;