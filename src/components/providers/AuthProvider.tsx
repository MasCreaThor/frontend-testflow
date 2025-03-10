// src/components/providers/AuthProvider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import '@/styles/loading.css';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initAuth, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initAuth();
      setIsInitialized(true);
    };

    initialize();
  }, [initAuth]);

  if (!isInitialized) {
    // Puedes mostrar un indicador de carga aquí si lo deseas
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}