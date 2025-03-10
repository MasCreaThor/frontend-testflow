// src/app/dashboard/documents/page.tsx
'use client';

import React from 'react';

export default function DocumentsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mis Documentos</h1>
        <p className="page-description">Gestiona tus documentos y archivos PDF</p>
      </div>
      
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <h2 className="empty-title">No has subido documentos aún</h2>
        <p className="empty-description">
          Comienza subiendo tus materiales de estudio en formato PDF para generar cuestionarios automáticos.
        </p>
        <button className="primary-button">
          <i className="fas fa-upload"></i>
          Subir documento
        </button>
      </div>
    </div>
  );
}