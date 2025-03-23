// src/app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import useAuthStore from '@/store/auth.store';
import useAdminStore from '@/store/admin.store';
import AccessDenied from '@/components/common/AccessDenied';
import '@/styles/admin/admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { hasAdminAccess, isLoading: adminLoading, checkAdminAccess } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [accessChecked, setAccessChecked] = useState(false);

  // Verificar autenticación y permisos de admin
  useEffect(() => {
    async function checkAccess() {
      if (!authLoading) {

        if (!isAuthenticated) {
          router.push('/auth/login');
          return;
        }

        await checkAdminAccess();
        setAccessChecked(true);
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [isAuthenticated, authLoading, router, checkAdminAccess]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mientras se verifican los permisos, mostramos una pantallita de carga
  if (isLoading || authLoading || adminLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  if (!hasAdminAccess && accessChecked) {
    return <AccessDenied />;
  }

  // Solo si paso la codicion anterior entra al admin
  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader toggleSidebar={toggleSidebar} currentPath={pathname} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}