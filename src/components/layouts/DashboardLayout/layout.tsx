// src/app/dashboard/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import useAuthStore from '@/store/auth.store';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
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

  // Si no está autenticado, no mostrar nada (redirigirá en el useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, mostrar el layout con el contenido
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}