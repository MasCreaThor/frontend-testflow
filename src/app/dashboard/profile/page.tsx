// src/app/dashboard/profile/page.tsx
'use client';

import React, { useEffect } from 'react';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import useProfile from '@/hooks/useProfile';
import useAuthStore from '@/store/auth.store';
import '@/styles/profile.css';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, isLoading, error, loadProfile } = useProfile();

  // Cargar perfil del usuario al montar el componente
  useEffect(() => {
    if (user?._id) {
      loadProfile();
    }
  }, [user, loadProfile]);

  if (isLoading && !profile) {
    return (
      <div className="page-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="error-title">Error al cargar el perfil</h2>
          <p className="error-message">{error}</p>
          <button 
            className="primary-button" 
            onClick={() => loadProfile()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-description">Administra tu información personal y preferencias</p>
      </div>
      
      <div className="profile-container">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}