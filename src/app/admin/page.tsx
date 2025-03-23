// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import '@/styles/admin/admin-dashboard.css';

type AdminStats = {
  users: number;
  documents: number;
  quizzes: number;
  roles: number;
};

type ActivityItem = {
  id: string;
  text: string;
  time: string;
  type: 'user' | 'document' | 'role';
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    users: 0,
    documents: 0,
    quizzes: 0,
    roles: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getStats();
        setStats(data);
        
        // Simulamos datos de actividad para el apartado de recientes (Implementar logica correspondiente para quitar este ejemplo)

        setActivities([
          {
            id: '1',
            text: 'Nuevo usuario registrado',
            time: 'Hace 2 horas',
            type: 'user'
          },
          {
            id: '2',
            text: 'Documento subido',
            time: 'Hace 4 horas',
            type: 'document'
          },
          {
            id: '3',
            text: 'Rol asignado a usuario',
            time: 'Ayer',
            type: 'role'
          }
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('No se pudieron cargar las estadísticas');
        
        // Datos de respaldo por ya que nos falta implementarlos en la parte del backend
        setStats({
          users: 0,
          documents: 0,
          quizzes: 0,
          roles: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Obtener el icono según el tipo de actividad
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'user':
        return 'fas fa-user-plus';
      case 'document':
        return 'fas fa-file-upload';
      case 'role':
        return 'fas fa-user-shield';
      default:
        return 'fas fa-bell';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1 className="page-title">Panel de Administración</h1>
        <p className="page-description">
          Bienvenido al panel administrativo de TestFlow. Aquí podrás gestionar usuarios, roles, permisos y contenido del sistema.
        </p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Usuarios</h3>
          <div className="stat-value">{stats.users}</div>
          <p className="stat-description">Usuarios registrados en el sistema</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Documentos</h3>
          <div className="stat-value">{stats.documents}</div>
          <p className="stat-description">Documentos subidos por usuarios</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Cuestionarios</h3>
          <div className="stat-value">{stats.quizzes}</div>
          <p className="stat-description">Cuestionarios generados</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Roles</h3>
          <div className="stat-value">{stats.roles}</div>
          <p className="stat-description">Roles definidos en el sistema</p>
        </div>
      </div>

      <div className="admin-sections">
        <div className="section">
          <h2 className="section-title">Actividad Reciente</h2>
          <div className="section-content">
            <div className="activity-list">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-icon">
                      <i className={getActivityIcon(activity.type)}></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.text}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-activity">No hay actividad reciente</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="section-content">
            <div className="quick-actions">
              <button 
                className="action-button" 
                onClick={() => window.location.href = '/admin/users'}
              >
                <i className="fas fa-user-plus"></i>
                <span>Usuarios</span>
              </button>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/admin/user-roles'}
              >
                <i className="fas fa-user-tag"></i>
                <span>Asignar Rol</span>
              </button>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/admin/roles'}
              >
                <i className="fas fa-shield-alt"></i>
                <span>Roles</span>
              </button>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/admin/categories'}
              >
                <i className="fas fa-list"></i>
                <span>Categorías</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}