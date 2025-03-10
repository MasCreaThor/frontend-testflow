// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/auth.store';
import '@/styles/dashboard-page.css';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState('');

  // Definir el saludo según la hora del día
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Buenos días');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  // Datos de estadísticas (mock)
  const stats = [
    { label: 'Documentos', value: 12, icon: 'fas fa-file-alt', color: '#4F46E5' },
    { label: 'Cuestionarios', value: 25, icon: 'fas fa-question-circle', color: '#10B981' },
    { label: 'Sesiones de estudio', value: 18, icon: 'fas fa-book', color: '#F59E0B' },
    { label: 'Horas de estudio', value: 42, icon: 'fas fa-clock', color: '#8B5CF6' },
  ];

  return (
    <div className="dashboard-page">
      <div className="welcome-section">
        <h1 className="welcome-title">
          {greeting}, Usuario
        </h1>
        <p className="welcome-subtitle">
          Bienvenido de nuevo a tu panel de estudio personalizado
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Actividad Reciente</h2>
            <button className="section-action">Ver todo</button>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">Has subido un nuevo documento <span>Apuntes de Física</span></p>
                <p className="activity-time">Hace 2 horas</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">Has completado un cuestionario <span>Introducción a la Programación</span></p>
                <p className="activity-time">Ayer</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">Sesión de estudio completada <span>45 minutos</span></p>
                <p className="activity-time">Hace 2 días</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Cuestionarios Recomendados</h2>
            <button className="section-action">Ver más</button>
          </div>
          <div className="recommendations-list">
            <div className="recommendation-item">
              <div className="recommendation-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="recommendation-content">
                <h3 className="recommendation-title">Matemáticas Avanzadas</h3>
                <p className="recommendation-desc">20 preguntas · Nivel intermedio</p>
              </div>
              <button className="recommendation-action">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="recommendation-content">
                <h3 className="recommendation-title">Fundamentos de Programación</h3>
                <p className="recommendation-desc">15 preguntas · Nivel básico</p>
              </div>
              <button className="recommendation-action">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}