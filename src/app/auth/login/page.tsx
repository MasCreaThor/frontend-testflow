// src/app/auth/login/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import useAuthStore from '@/store/auth.store';
import '@/styles/auth.css';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado o aún está cargando, mostrar el formulario de login
  return <LoginForm />;
}