// src/app/admin/roles/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService, RoleData } from '@/services/admin.service';
import '@/styles/admin/admin-roles.css';

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isActive: true
  });

  // Cargar roles al iniciar
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Error al cargar los roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = (role: RoleData) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleManagePermissions = (role: RoleData) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleClosePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedRole(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar rol (crear o actualizar)
    handleCloseModal();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPermissionCount = (permissions: string[]) => {
    if (permissions.length === 0) return 'Sin permisos';
    if (permissions.length === 1) return '1 permiso';
    return `${permissions.length} permisos`;
  };

  if (isLoading && roles.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando roles...</p>
      </div>
    );
  }

  return (
    <div className="admin-roles">
      <div className="page-header">
        <h1 className="page-title">Gestión de Roles</h1>
        <p className="page-description">
          Administra los roles del sistema y sus permisos asociados.
        </p>
      </div>

      <div className="roles-actions">
        <button className="create-button" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus-circle"></i>
          Crear Nuevo Rol
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="roles-grid">
        {roles.map(role => (
          <div key={role._id} className="role-card">
            <div className="role-header">
              <h3 className="role-name">{role.name}</h3>
              <span className={`role-status ${role.isActive ? 'active' : 'inactive'}`}>
                {role.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="role-description">
              {role.description || 'Sin descripción'}
            </p>
            <div className="role-permissions">
              <span className="permissions-count">
                {formatPermissionCount(role.permissions)}
              </span>
              <div className="permissions-preview">
                {role.permissions.slice(0, 3).map(perm => (
                  <span key={perm} className="permission-badge">
                    {perm}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="permission-badge more">
                    +{role.permissions.length - 3} más
                  </span>
                )}
              </div>
            </div>
            <div className="role-dates">
              <span className="date-label">Creado:</span>
              <span className="date-value">{formatDate(role.createdAt)}</span>
            </div>
            <div className="role-actions">
              <button 
                className="action-button view" 
                onClick={() => handleSelectRole(role)}
                title="Ver detalles"
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="action-button edit" 
                title="Editar rol"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="action-button permissions" 
                title="Gestionar permisos"
                onClick={() => handleManagePermissions(role)}
              >
                <i className="fas fa-shield-alt"></i>
              </button>
              <button 
                className="action-button delete" 
                title="Eliminar rol"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ver detalles del rol */}
      {isModalOpen && selectedRole && (
        <div className="modal-overlay">
          <div className="role-details-modal">
            <div className="modal-header">
              <h2>Detalles del Rol</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="role-detail">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedRole._id}</span>
              </div>
              <div className="role-detail">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{selectedRole.name}</span>
              </div>
              <div className="role-detail">
                <span className="detail-label">Descripción:</span>
                <span className="detail-value">{selectedRole.description || 'Sin descripción'}</span>
              </div>
              <div className="role-detail">
                <span className="detail-label">Estado:</span>
                <span className={`detail-value status ${selectedRole.isActive ? 'active' : 'inactive'}`}>
                  {selectedRole.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="role-detail">
                <span className="detail-label">Fecha de creación:</span>
                <span className="detail-value">{formatDate(selectedRole.createdAt)}</span>
              </div>
              <div className="role-detail">
                <span className="detail-label">Última actualización:</span>
                <span className="detail-value">{formatDate(selectedRole.updatedAt)}</span>
              </div>
              <div className="role-detail permissions-detail">
                <span className="detail-label">Permisos ({selectedRole.permissions.length}):</span>
                <div className="permissions-list">
                  {selectedRole.permissions.map(permission => (
                    <span key={permission} className="permission-badge">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleCloseModal}>
                Cerrar
              </button>
              <button className="primary-button">
                <i className="fas fa-edit"></i>
                Editar Rol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para gestionar permisos */}
      {isPermissionModalOpen && selectedRole && (
        <div className="modal-overlay">
          <div className="permissions-modal">
            <div className="modal-header">
              <h2>Gestionar Permisos: {selectedRole.name}</h2>
              <button className="close-button" onClick={handleClosePermissionModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p className="permissions-instructions">
                Selecciona los permisos que deseas asignar a este rol. Puedes usar los selectores de grupo para asignar todos los permisos de una categoría.
              </p>
              
              <div className="permissions-search">
                <div className="search-input-container">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Filtrar permisos..." 
                  />
                </div>
              </div>
              
              {/* Grupos de permisos (simplificados para este ejemplo) */}
              <div className="permissions-groups">
                <div className="permission-group">
                  <div className="group-header">
                    <label className="group-checkbox">
                      <input type="checkbox" />
                      <span className="group-name">Usuarios</span>
                    </label>
                    <span className="group-count">5 permisos</span>
                  </div>
                  <div className="group-permissions">
                    {/* Permisos individuales dentro del grupo */}
                    <label className="permission-checkbox">
                      <input type="checkbox" />
                      <span className="permission-name">users:create</span>
                    </label>
                    <label className="permission-checkbox">
                      <input type="checkbox" />
                      <span className="permission-name">users:read</span>
                    </label>
                    {/* Más permisos... */}
                  </div>
                </div>
                {/* Más grupos de permisos... */}
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleClosePermissionModal}>
                Cancelar
              </button>
              <button className="primary-button">
                <i className="fas fa-save"></i>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}