// src/hooks/useAuth.ts
'use client'; // Importante para asegurar que los hooks se usen solo en Client Components

import { useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Usar 'next/navigation' en App Router
import useAuthStore from '@/store/auth.store';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login: loginStore,
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
    logout,
    requestPasswordReset,
    resetPassword,
    clearError
  };
}

export default useAuth;