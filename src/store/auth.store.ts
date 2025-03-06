import { create } from 'zustand';
import { AuthService } from '@/services/auth.service';
import { 
  ResetPasswordRequest, 
  SetNewPasswordRequest,
  AuthResponse
} from '@/types/auth.types';

interface User {
  _id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones relacionadas con recuperación de contraseña
  requestPasswordReset: (data: ResetPasswordRequest) => Promise<boolean>;
  resetPassword: (data: SetNewPasswordRequest) => Promise<boolean>;
  
  // Acciones generales de autenticación
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Acciones para el manejo de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Solicitar correo para restablecer contraseña
  requestPasswordReset: async (data: ResetPasswordRequest) => {
    try {
      set({ isLoading: true, error: null });
      await AuthService.requestPasswordReset(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al solicitar restablecimiento de contraseña' 
      });
      return false;
    }
  },
  
  // Restablecer contraseña con token
  resetPassword: async (data: SetNewPasswordRequest) => {
    try {
      set({ isLoading: true, error: null });
      await AuthService.resetPassword(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al restablecer la contraseña' 
      });
      return false;
    }
  },
  
  // Iniciar sesión
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await AuthService.login(email, password);
      set({ 
        user: response.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al iniciar sesión' 
      });
    }
  },
  
  // Cerrar sesión
  logout: () => {
    AuthService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  // Utilidades para manejo de estado
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}));

export default useAuthStore;