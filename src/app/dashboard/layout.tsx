// src/app/dashboard/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import useAuthStore from '@/store/auth.store';
import '@/styles/dashboard.css';
import '@/styles/pages.css';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Verificar autenticacion de usuario
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}