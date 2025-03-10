// src/store/auth.store.ts
import { create } from 'zustand';
import { AuthService } from '@/services/auth.service';
import { 
  ResetPasswordRequest, 
  SetNewPasswordRequest,
  AuthResponse,
  RegisterRequest
} from '@/types/auth.types';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones de registro
  register: (data: RegisterRequest) => Promise<boolean>;
  
  // Acciones relacionadas con recuperación de contraseña
  requestPasswordReset: (data: ResetPasswordRequest) => Promise<boolean>;
  resetPassword: (data: SetNewPasswordRequest) => Promise<boolean>;
  
  // Acciones generales de autenticación
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
  
  // Acciones para el manejo de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Empezamos con loading true para evitar redirecciones innecesarias
  error: null,
  
  // Inicializar estado de autenticación basado en localStorage
  initAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Decodificar el token para verificar expiración
          const decodedToken = jwtDecode<JwtPayload>(token);
          
          // Verificar si el token ha expirado
          const isTokenValid = decodedToken.exp * 1000 > Date.now();
          
          if (isTokenValid) {
            // Token válido, establecer el usuario y estado de autenticación
            set({ 
              user: {
                _id: decodedToken.sub,
                email: decodedToken.email
              },
              isAuthenticated: true,
              isLoading: false
            });
            return;
          } else {
            // Token expirado, intentar refrescar si hay un refreshToken
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await AuthService.refreshToken(refreshToken);
                localStorage.setItem('accessToken', response.accessToken);
                if (response.refreshToken) {
                  localStorage.setItem('refreshToken', response.refreshToken);
                }
                
                set({ 
                  user: response.user,
                  isAuthenticated: true,
                  isLoading: false
                });
                return;
              } catch (error) {
                // Error al refrescar el token, limpiar localStorage
                AuthService.logout();
              }
            }
          }
        } catch (error) {
          // Error al decodificar el token, limpiar localStorage
          AuthService.logout();
        }
      }
      
      // Si no hay token o el token es inválido
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      AuthService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },
  
  // Registrar nuevo usuario
  register: async (data: RegisterRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await AuthService.register(data);
      set({ 
        user: response.user,
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al registrar usuario' 
      });
      return false;
    }
  },
  
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