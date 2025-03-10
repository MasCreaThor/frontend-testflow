// src/components/layouts/DashboardLayout/Header.tsx
'use client';

import React from 'react';
import '@/styles/header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
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