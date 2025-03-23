// src/components/common/AccessDenied.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/access-denied.css';

const AccessDenied: React.FC = () => {
  const router = useRouter();

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <div className="error-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h1 className="error-title">Acceso Denegado</h1>
        <p className="error-message">
          No tienes permisos para acceder al Panel de Administración.
          Este área está restringida a usuarios con rol de administrador.
        </p>
        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => router.push('/dashboard')}
          >
            <i className="fas fa-arrow-left"></i>
            Volver al Dashboard
          </button>
          <Link href="/auth/login" className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            Cerrar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;