// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';
import '@/styles/admin/admin-dashboard.css';

type AdminStats = {
  users: number;
  documents: number;
  quizzes: number;
  roles: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    users: 0,
    documents: 0,
    quizzes: 0,
    roles: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // En una implementación real, esto obtendría datos del backend
        const data = await adminService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('No se pudieron cargar las estadísticas');
        // Usar datos de muestra por ahora
        setStats({
          users: 43,
          documents: 128,
          quizzes: 56,
          roles: 4
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en el sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents}</div>
            <p className="text-xs text-muted-foreground">
              Documentos subidos por usuarios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cuestionarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quizzes}</div>
            <p className="text-xs text-muted-foreground">
              Cuestionarios generados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roles}</div>
            <p className="text-xs text-muted-foreground">
              Roles definidos en el sistema
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="admin-sections">
        <div className="section">
          <h2 className="section-title">Actividad Reciente</h2>
          <div className="section-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">Nuevo usuario registrado: <span>usuario@ejemplo.com</span></p>
                  <p className="activity-time">Hace 2 horas</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-file-upload"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">Documento subido: <span>Material de estudio</span></p>
                  <p className="activity-time">Hace 4 horas</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">Rol asignado a usuario: <span>admin@testflow.com</span></p>
                  <p className="activity-time">Ayer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="section-content">
            <div className="quick-actions">
              <button className="action-button">
                <i className="fas fa-user-plus"></i>
                <span>Crear Usuario</span>
              </button>
              <button className="action-button">
                <i className="fas fa-user-tag"></i>
                <span>Asignar Rol</span>
              </button>
              <button className="action-button">
                <i className="fas fa-shield-alt"></i>
                <span>Gestionar Permisos</span>
              </button>
              <button className="action-button">
                <i className="fas fa-cog"></i>
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}