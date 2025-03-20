// src/app/admin/layout.tsx (actualizado)
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import useAuthStore from '@/store/auth.store';
import useAdminStore from '@/store/admin.store';
import '@/styles/admin/admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { checkAdminAccess, hasAdminAccess, isLoading: isAdminLoading } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      const verifyAdmin = async () => {
        await checkAdminAccess();
        setAdminCheckComplete(true);
      };
      verifyAdmin();
    }
  }, [isAuthenticated, isLoading, router, checkAdminAccess]);

  // Verificar si el usuario tiene permisos de administrador
  useEffect(() => {
    if (adminCheckComplete && !hasAdminAccess) {
      console.log('Usuario no tiene permisos de administrador, redirigiendo...');
      router.push('/dashboard');
    }
  }, [hasAdminAccess, adminCheckComplete, router]);

  // Función para alternar el sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Si está cargando, mostrar spinner
  if (isLoading || isAdminLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando panel administrativo...</p>
      </div>
    );
  }

  // Si no está autenticado o no tiene permisos, no mostrar nada
  if (!isAuthenticated || (adminCheckComplete && !hasAdminAccess)) {
    return null;
  }

  // Si está autenticado y tiene permisos, mostrar el layout
  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}