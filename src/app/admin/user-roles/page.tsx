// src/app/admin/user-roles/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import '@/styles/admin/admin-user-roles.css';

interface RoleData {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

interface UserData {
  _id: string;
  email: string;
  createdAt?: string;
  lastLogin?: string;
  roles?: RoleData[];
}

interface UserRoleData {
  _id: string;
  userId: string;
  roleId: string;
  expiresAt?: string;
  isActive?: boolean;
  grantedBy?: string;
  createdAt?: string;
  user?: {
    _id: string;
    email: string;
  };
  role?: {
    _id: string;
    name: string;
  };
}

export default function UserRolesPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    roleId: '',
    expiresAt: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users, roles, and user roles
      const [usersData, rolesData, userRolesData] = await Promise.all([
        adminService.getUsers(),
        adminService.getRoles(),
        adminService.getUserRoles()
      ]);
      
      setUsers(usersData.users || usersData);
      setRoles(rolesData);
      setUserRoles(userRolesData);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
      
      // Sample data for development
      const mockUsers: UserData[] = [
        {
          _id: '1',
          email: 'admin@testflow.com',
          createdAt: '2023-09-01T10:00:00.000Z',
          lastLogin: '2023-09-15T08:30:00.000Z'
        },
        {
          _id: '2',
          email: 'usuario1@testflow.com',
          createdAt: '2023-09-02T11:20:00.000Z',
          lastLogin: '2023-09-14T09:15:00.000Z'
        },
        {
          _id: '3',
          email: 'instructor@testflow.com',
          createdAt: '2023-09-03T14:35:00.000Z',
          lastLogin: '2023-09-12T16:45:00.000Z'
        }
      ];
      
      const mockRoles: RoleData[] = [
        {
          _id: '1',
          name: 'admin',
          description: 'Acceso completo al sistema'
        },
        {
          _id: '2',
          name: 'user',
          description: 'Usuario regular del sistema'
        },
        {
          _id: '3',
          name: 'instructor',
          description: 'Instructor o profesor con acceso a funciones adicionales'
        }
      ];
      
      const mockUserRoles: UserRoleData[] = [
        {
          _id: '1',
          userId: '1',
          roleId: '1',
          isActive: true,
          createdAt: '2023-09-01T10:00:00.000Z',
          user: { _id: '1', email: 'admin@testflow.com' },
          role: { _id: '1', name: 'admin' }
        },
        {
          _id: '2',
          userId: '2',
          roleId: '2',
          isActive: true,
          createdAt: '2023-09-02T11:20:00.000Z',
          user: { _id: '2', email: 'usuario1@testflow.com' },
          role: { _id: '2', name: 'user' }
        },
        {
          _id: '3',
          userId: '3',
          roleId: '2',
          isActive: true,
          createdAt: '2023-09-03T14:35:00.000Z',
          user: { _id: '3', email: 'instructor@testflow.com' },
          role: { _id: '2', name: 'user' }
        },
        {
          _id: '4',
          userId: '3',
          roleId: '3',
          isActive: true,
          createdAt: '2023-09-03T14:40:00.000Z',
          user: { _id: '3', email: 'instructor@testflow.com' },
          role: { _id: '3', name: 'instructor' }
        }
      ];
      
      setUsers(mockUsers);
      setRoles(mockRoles);
      setUserRoles(mockUserRoles);
    } finally {
      setIsLoading(false);
    }
  };

  // Process users to add their roles
  const usersWithRoles = users.map(user => {
    const userRolesData = userRoles.filter(ur => 
      ur.userId === user._id && ur.isActive
    );
    
    const rolesData = userRolesData.map(ur => {
      const role = roles.find(r => r._id === ur.roleId);
      return role ? role : ur.role;
    }).filter(Boolean) as RoleData[];
    
    return {
      ...user,
      roles: rolesData
    };
  });

  // Filter users based on search term
  const filteredUsers = usersWithRoles.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.roles?.some(role => role.name.toLowerCase().includes(searchLower))
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled via state
  };

  const handleOpenAssignRoleModal = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      userId: user._id,
      roleId: '',
      expiresAt: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Assign role to user
      const newUserRole = await adminService.assignRole(formData.userId, formData.roleId);
      
      // Update userRoles state
      setUserRoles(prev => [...prev, newUserRole]);
      
      handleCloseModal();
      setError(null);
    } catch (err) {
      console.error('Error assigning role:', err);
      setError('Error al asignar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este rol del usuario? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await adminService.removeRole(userId, roleId);
      
      // Update userRoles state
      setUserRoles(prev => 
        prev.filter(ur => !(ur.userId === userId && ur.roleId === roleId && ur.isActive))
      );
    } catch (err) {
      console.error('Error removing role:', err);
      setError('Error al eliminar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleBadgeClass = (roleName: string) => {
    switch (roleName) {
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

  if (isLoading && users.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="admin-user-roles">
      <div className="page-header">
        <h1 className="page-title">Gestión de Roles de Usuario</h1>
        <p className="page-description">
          Asigna y administra los roles de los usuarios de la plataforma.
        </p>
      </div>

      <div className="user-roles-actions">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por email o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
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
              <th>Usuario</th>
              <th>Fecha de Registro</th>
              <th>Último Acceso</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>
                  <div className="roles-container">
                    {user.roles && user.roles.length > 0 ? user.roles.map(role => (
                      <div className="role-item" key={role._id}>
                        <span className={`role-badge ${getRoleBadgeClass(role.name)}`}>
                          {role.name}
                        </span>
                        <button 
                          className="remove-role-button"
                          onClick={() => handleRemoveRole(user._id, role._id)}
                          title="Eliminar rol"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )) : (
                      <span className="no-roles">Sin roles</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-button roles" 
                      onClick={() => handleOpenAssignRoleModal(user)}
                      title="Asignar rol"
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

      {/* Modal for assigning role */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="assign-role-modal">
            <div className="modal-header">
              <h2>Asignar Rol a Usuario</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="assign-role-form">
              <div className="modal-content">
                <div className="user-info">
                  <span className="info-label">Usuario:</span>
                  <span className="info-value">{selectedUser.email}</span>
                </div>
                
                <div className="current-roles">
                  <span className="info-label">Roles actuales:</span>
                  <div className="roles-list">
                    {selectedUser.roles && selectedUser.roles.length > 0 ? selectedUser.roles.map(role => (
                      <span key={role._id} className={`role-badge ${getRoleBadgeClass(role.name)}`}>
                        {role.name}
                      </span>
                    )) : (
                      <span className="no-roles">Sin roles</span>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="roleId" className="form-label">Rol a asignar</label>
                  <select
                    id="roleId"
                    name="roleId"
                    className="form-input"
                    value={formData.roleId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(role => (
                      <option
                        key={role._id}
                        value={role._id}
                        disabled={selectedUser.roles?.some(r => r._id === role._id)}
                      >
                        {role.name} {selectedUser.roles?.some(r => r._id === role._id) ? '(Ya asignado)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="expiresAt" className="form-label">Fecha de expiración (opcional)</label>
                  <input
                    type="date"
                    id="expiresAt"
                    name="expiresAt"
                    className="form-input"
                    value={formData.expiresAt}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="help-text">
                    Si no se especifica una fecha, el rol no expirará.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={isLoading || !formData.roleId}
                >
                  {isLoading ? 'Asignando...' : 'Asignar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}