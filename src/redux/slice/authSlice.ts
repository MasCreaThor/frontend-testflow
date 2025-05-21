import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipos para el estado de autenticación
interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunk para manejar el login con Google
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // Aquí implementarías la lógica real de autenticación con Google
      // Por ahora es un ejemplo simulado
      // Ejemplo: const response = await googleAuthProvider.signIn();
      
      // Simular una respuesta exitosa
      return {
        id: 'user123',
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        picture: 'https://example.com/avatar.jpg',
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al iniciar sesión con Google');
    }
  }
);

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acción para cerrar sesión
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Acción para limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Manejo de estados del thunk de login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const { logout, clearError } = authSlice.actions;

// Exportar reducer
export default authSlice.reducer;
export type { AuthState };
export type { User };
// Tipos para el estado de la interfaz de usuario (UI)
