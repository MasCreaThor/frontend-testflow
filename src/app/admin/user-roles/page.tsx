// src/app/admin/user-roles/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService, UserRoleData, RoleData } from '@/services/admin.service';
import '@/styles/admin/admin-user-roles.css';

export default function UserRolesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    roleId: '',
    expiresAt: ''
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // tra los usuarios, roles, y user roles
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
    } finally {
      setIsLoading(false);
    }
  };

  // procesar usuario al añadir roles
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

  const filteredUsers = usersWithRoles.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.roles?.some((role: RoleData) => role.name.toLowerCase().includes(searchLower))
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleOpenAssignRoleModal = (user: any) => {
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
      const newUserRole = await adminService.assignRole(formData.userId, formData.roleId);

      setUserRoles(prev => [...prev, newUserRole]);
      
      fetchData();
      
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
      
      // actualizar rol
      setUserRoles(prev => 
        prev.filter(ur => !(ur.userId === userId && ur.roleId === roleId && ur.isActive))
      );
      
      // refresaca para traer los roles actualizados
      fetchData();
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
                    {user.roles && user.roles.length > 0 ? user.roles.map((role: RoleData) => (
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
                    {selectedUser.roles && selectedUser.roles.length > 0 ? selectedUser.roles.map((role: RoleData) => (
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
                        disabled={selectedUser.roles?.some((r: RoleData) => r._id === role._id)}
                      >
                        {role.name} {selectedUser.roles?.some((r: RoleData) => r._id === role._id) ? '(Ya asignado)' : ''}
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