// src/components/layouts/DashboardLayout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import '@/styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  const handleLinkClick = () => {
    // En dispositivos móviles, cerrar el sidebar al hacer clic en un enlace
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Define los elementos de navegación
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'fas fa-home',
    },
    {
      name: 'Documentos',
      href: '/dashboard/documents',
      icon: 'fas fa-file-alt',
    },
    {
      name: 'Cuestionarios',
      href: '/dashboard/quizzes',
      icon: 'fas fa-question-circle',
    },
    {
      name: 'Sesiones de Estudio',
      href: '/dashboard/study',
      icon: 'fas fa-book',
    },
    {
      name: 'Perfil',
      href: '/dashboard/profile',
      icon: 'fas fa-user',
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <h1 className="logo-text">TestFlow</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li 
              key={item.name} 
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <Link href={item.href} className="nav-link" onClick={handleLinkClick}>
                <i className={`nav-icon ${item.icon}`}></i>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-details">
            <span className="user-name">Usuario</span>
            <span className="user-email">{user?.email || 'usuario@example.com'}</span>
          </div>
        </div>
        <button 
          className="logout-button"
          onClick={() => {
            logout();
            router.push('/auth/login');
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}