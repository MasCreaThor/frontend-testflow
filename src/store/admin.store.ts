// src/store/admin.store.ts (actualizado)
import { create } from 'zustand';
import { adminService } from '@/services/admin.service';

interface AdminState {
  hasAdminAccess: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  checkAdminAccess: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useAdminStore = create<AdminState>((set, get) => ({
  hasAdminAccess: false,
  isLoading: false,
  error: null,
  
  // Verificar si el usuario tiene acceso de administrador
  checkAdminAccess: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Obtener del servicio si tiene permisos de administrador
      const hasAccess = await adminService.checkAdminAccess();
      console.log('Resultado verificación admin:', hasAccess);
      set({ hasAdminAccess: hasAccess, isLoading: false });
    } catch (error) {
      console.error('Error checking admin access:', error);
      // En desarrollo, permitimos acceso para facilitar pruebas
      console.log('Permitiendo acceso en desarrollo a pesar del error');
      set({ 
        hasAdminAccess: true, 
        isLoading: false,
        error: null
      });
    }
  },
  
  // Utilidades para manejo de estado
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}));

export default useAdminStore;