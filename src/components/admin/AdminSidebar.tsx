// src/components/admin/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import '@/styles/admin/admin-sidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export default function AdminSidebar({ isOpen, toggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const handleLinkClick = () => {
    // En dispositivos se cierra sidebar al hacer clic en un enlace
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'fas fa-tachometer-alt',
    },
    {
      name: 'Usuarios',
      href: '/admin/users',
      icon: 'fas fa-users',
    },
    {
      name: 'Roles',
      href: '/admin/roles',
      icon: 'fas fa-user-tag',
    },
    {
      name: 'Asignación de Roles',
      href: '/admin/user-roles',
      icon: 'fas fa-user-shield',
    },
    {
      name: 'Categorías',
      href: '/admin/categories',
      icon: 'fas fa-list',
    },
    {
      name: 'Objetivos de Estudio',
      href: '/admin/study-goals',
      icon: 'fas fa-bullseye',
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <h1 className="logo-text">TestFlow Admin</h1>
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
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="user-details">
            <span className="user-name">Administrador</span>
            <span className="user-email">{user?.email || 'admin@example.com'}</span>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className="dashboard-button"
            onClick={() => router.push('/dashboard')}
          >
            <i className="fas fa-home"></i>
            <span>Ir al Dashboard</span>
          </button>
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
      </div>
    </aside>
  );
}