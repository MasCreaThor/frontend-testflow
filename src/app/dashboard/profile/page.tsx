// src/app/dashboard/profile/page.tsx
'use client';

import React from 'react';
import useAuthStore from '@/store/auth.store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-description">Administra tu información personal y preferencias</p>
      </div>
      
      <div className="profile-container">
        <div className="profile-section">
          <h2 className="section-title">Información Personal</h2>
          
          <div className="profile-card">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            
            <div className="profile-info">
              <h3 className="profile-name">Usuario</h3>
              <p className="profile-email">{user?.email}</p>
              
              <button className="secondary-button small">
                <i className="fas fa-camera"></i>
                Cambiar foto
              </button>
            </div>
          </div>
          
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Tu nombre"
                  defaultValue=""
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Tu apellido"
                  defaultValue=""
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="tucorreo@ejemplo.com"
                defaultValue={user?.email || ''}
                disabled
              />
              <p className="form-hint">El correo electrónico no se puede cambiar</p>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="primary-button">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
        
        <div className="profile-section">
          <h2 className="section-title">Seguridad</h2>
          
          <form className="profile-form">
            <div className="form-group">
              <label className="form-label">Contraseña Actual</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="primary-button">
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}