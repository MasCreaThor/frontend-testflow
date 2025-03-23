// src/app/admin/categories/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService, CategoryData } from '@/services/admin.service';
import '@/styles/admin/admin-categories.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Cargar de categorias
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar las categorías');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateMode(true);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryData) => {
    setIsCreateMode(false);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    setIsLoading(true);
    
    try {
      if (isCreateMode) {
        // Crear nueva categoría
        const newCategory = await adminService.createCategory(formData);
        setCategories(prev => [...prev, newCategory]);
      } else if (selectedCategory) {
        // Actualizar categoría existente
        const updatedCategory = await adminService.updateCategory(selectedCategory._id, formData);
        setCategories(prev => 
          prev.map(cat => cat._id === selectedCategory._id ? updatedCategory : cat)
        );
      }
      
      handleCloseModal();
      setError(null);
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      setError('Error al guardar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await adminService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      setError('Error al eliminar la categoría');
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading && categories.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="page-header">
        <h1 className="page-title">Gestión de Categorías</h1>
        <p className="page-description">
          Administra las categorías de estudio disponibles para los estudiantes en la plataforma.
        </p>
      </div>

      <div className="categories-actions">
        <button className="create-button" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus-circle"></i>
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      {categories.length === 0 && !isLoading ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-folder-open"></i>
          </div>
          <h2 className="empty-title">No hay categorías</h2>
          <p className="empty-description">
            No se han encontrado categorías en el sistema. Crea una nueva categoría para comenzar.
          </p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category._id} className={`category-card ${!category.isActive ? 'inactive' : ''}`}>
              <div className="category-header">
                <h3 className="category-name">{category.name}</h3>
                <span className={`category-status ${category.isActive ? 'active' : 'inactive'}`}>
                  {category.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="category-description">
                {category.description || 'Sin descripción'}
              </p>
              <div className="category-dates">
                <span className="date-item">
                  <i className="fas fa-calendar-alt"></i>
                  {formatDate(category.createdAt)}
                </span>
              </div>
              <div className="category-actions">
                <button 
                  className="action-button edit" 
                  onClick={() => handleOpenEditModal(category)}
                  title="Editar categoría"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="action-button delete" 
                  onClick={() => handleDeleteCategory(category._id)}
                  title="Eliminar categoría"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="category-modal">
            <div className="modal-header">
              <h2>{isCreateMode ? 'Crear Nueva Categoría' : 'Editar Categoría'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre de la Categoría</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                    placeholder="Ej: Matemáticas, Física, Literatura..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="form-input"
                    rows={4}
                    placeholder="Breve descripción de la categoría..."
                  ></textarea>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                    />
                    <span>Categoría Activa</span>
                  </label>
                  <p className="help-text">
                    Las categorías inactivas no serán visibles para los estudiantes.
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
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Guardando...' 
                    : isCreateMode 
                      ? 'Crear Categoría' 
                      : 'Guardar Cambios'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}