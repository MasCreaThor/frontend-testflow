// src/components/admin/AdminHeader.tsx
'use client';

import React from 'react';
import '@/styles/admin/admin-header.css';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className="fas fa-bars"></i>
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-item">Panel de Administración</span>
        </div>
      </div>
      
      <div className="header-search">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="search-input" 
          />
        </div>
      </div>
      
      <div className="header-actions">
        <div className="notification-bell">
          <button className="notification-button">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="help-button">
          <button className="help-icon">
            <i className="fas fa-question-circle"></i>
          </button>
        </div>
      </div>
    </header>
  );
}