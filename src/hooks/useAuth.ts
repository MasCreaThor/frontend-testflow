// src/hooks/useAuth.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import { RegisterRequest } from '@/types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login: loginStore,
    register: registerStore,
    logout: logoutStore,
    requestPasswordReset: requestResetStore,
    resetPassword: resetPasswordStore,
    clearError
  } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    clearError();
    await loginStore(email, password);
    
    // Si la autenticación fue exitosa, redirigir al dashboard
    if (useAuthStore.getState().isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loginStore, router, clearError]);

  // Añadimos el tipo correcto para el parámetro data
  const register = useCallback(async (data: RegisterRequest) => {
    clearError();
    const success = await registerStore(data);
    
    if (success) {
      router.push('/dashboard');
    }
    
    return success;
  }, [registerStore, router, clearError]);

  const logout = useCallback(() => {
    logoutStore();
    router.push('/login');
  }, [logoutStore, router]);

  const requestPasswordReset = useCallback(async (email: string) => {
    clearError();
    return await requestResetStore({ email });
  }, [requestResetStore, clearError]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    clearError();
    return await resetPasswordStore({ token, newPassword });
  }, [resetPasswordStore, clearError]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    clearError
  };
}

export default useAuth;