// src/app/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import '@/styles/admin/admin-users.css';

interface UserData {
  _id: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  roles: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // En una implementación real, esto obtendría datos del backend
      const response = await adminService.getUsers(currentPage, 10);
      
      // Datos de muestra para desarrollo
      const mockUsers: UserData[] = [
        {
          _id: '1',
          email: 'admin@testflow.com',
          createdAt: '2023-09-01T10:00:00.000Z',
          lastLogin: '2023-09-15T08:30:00.000Z',
          roles: ['admin']
        },
        {
          _id: '2',
          email: 'usuario1@testflow.com',
          createdAt: '2023-09-02T11:20:00.000Z',
          lastLogin: '2023-09-14T09:15:00.000Z',
          roles: ['user']
        },
        {
          _id: '3',
          email: 'instructor@testflow.com',
          createdAt: '2023-09-03T14:35:00.000Z',
          lastLogin: '2023-09-12T16:45:00.000Z',
          roles: ['instructor', 'user']
        },
        {
          _id: '4',
          email: 'usuario2@testflow.com',
          createdAt: '2023-09-04T08:15:00.000Z',
          roles: []
        },
        {
          _id: '5',
          email: 'contentmanager@testflow.com',
          createdAt: '2023-09-05T09:30:00.000Z',
          lastLogin: '2023-09-10T11:20:00.000Z',
          roles: ['content-manager']
        }
      ];
      
      setUsers(mockUsers);
      setTotalPages(5); // Simular 5 páginas
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementar búsqueda
    console.log('Buscando:', searchTerm);
    // En una implementación real, llamaríamos a la API con el término de búsqueda
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'role-badge-admin';
      case 'instructor':
        return 'role-badge-instructor';
      case 'content-manager':
        return 'role-badge-content';
      case 'user':
      default:
        return 'role-badge-user';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <p className="page-description">
          Administra los usuarios del sistema, asigna roles y gestiona permisos.
        </p>
      </div>

      <div className="users-actions">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">Buscar</button>
        </form>

        <button className="create-button">
          <i className="fas fa-user-plus"></i>
          Crear Usuario
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Fecha de Registro</th>
              <th>Último Acceso</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>
                  <div className="roles-container">
                    {user.roles.length > 0 ? user.roles.map(role => (
                      <span key={role} className={`role-badge ${getRoleBadgeClass(role)}`}>
                        {role}
                      </span>
                    )) : (
                      <span className="no-roles">Sin roles</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-button view" 
                      onClick={() => handleSelectUser(user)}
                      title="Ver detalles"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-button edit" 
                      title="Editar usuario"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-button delete" 
                      title="Eliminar usuario"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button 
                      className="action-button roles" 
                      title="Gestionar roles"
                    >
                      <i className="fas fa-user-tag"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="pagination-button" 
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          <i className="fas fa-chevron-left"></i>
          Anterior
        </button>
        
        <span className="pagination-info">Página {currentPage} de {totalPages}</span>
        
        <button 
          className="pagination-button" 
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Siguiente
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="user-details-modal">
            <div className="modal-header">
              <h2>Detalles del Usuario</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="user-detail">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedUser._id}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Fecha de registro:</span>
                <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Último acceso:</span>
                <span className="detail-value">{formatDate(selectedUser.lastLogin)}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Roles:</span>
                <div className="detail-value">
                  {selectedUser.roles.length > 0 ? (
                    <div className="modal-roles">
                      {selectedUser.roles.map(role => (
                        <span key={role} className={`role-badge ${getRoleBadgeClass(role)}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="no-roles">Sin roles asignados</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleCloseModal}>
                Cerrar
              </button>
              <button className="primary-button">
                <i className="fas fa-edit"></i>
                Editar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}