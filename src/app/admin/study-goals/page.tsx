// src/app/admin/study-goals/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminService, StudyGoalData, CategoryData } from '@/services/admin.service';
import '@/styles/admin/admin-study-goals.css';

export default function StudyGoalsPage() {
  const [studyGoals, setStudyGoals] = useState<StudyGoalData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudyGoal, setSelectedStudyGoal] = useState<StudyGoalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    isActive: true
  });
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [goalsLoaded, setGoalsLoaded] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {

      try {
        console.log('Solicitando categorías...');
        const categoriesData = await adminService.getCategories();
        console.log('Categorías recibidas:', categoriesData.length);
        setCategories(categoriesData);
        setCategoriesLoaded(true);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar las categorías. La página podría no funcionar correctamente.');
        setCategories([]);
      }
      
      try {
        console.log('Solicitando objetivos de estudio...');
        const goalsData = await adminService.getStudyGoals();
        console.log('Objetivos de estudio recibidos:', goalsData?.length || 0);
        setStudyGoals(goalsData || []);
        setGoalsLoaded(true);
      } catch (err) {
        console.error('Error al cargar objetivos de estudio:', err);
        setError('Error al cargar los objetivos de estudio.');
        setStudyGoals([]);
      }
    } catch (err) {
      console.error('Error general en fetchData:', err);
      setError('Error al cargar los datos. Por favor, intenta recargar la página.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateMode(true);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (studyGoal: StudyGoalData) => {
    setIsCreateMode(false);
    setSelectedStudyGoal(studyGoal);
    setFormData({
      name: studyGoal.name,
      description: studyGoal.description || '',
      categoryId: studyGoal.categoryId || '',
      isActive: studyGoal.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudyGoal(null);
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
    setError(null);
    
    try {
      if (isCreateMode) {
        const newStudyGoal = await adminService.createStudyGoal(formData);
        if (newStudyGoal) {
          setStudyGoals(prev => [...prev, newStudyGoal]);
        }
      } else if (selectedStudyGoal) {
        const updatedStudyGoal = await adminService.updateStudyGoal(selectedStudyGoal._id, formData);
        if (updatedStudyGoal) {
          setStudyGoals(prev => 
            prev.map(goal => goal._id === selectedStudyGoal._id ? updatedStudyGoal : goal)
          );
        }
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error saving study goal:', err);
      setError('Error al guardar el objetivo de estudio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudyGoal = async (studyGoalId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este objetivo de estudio? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await adminService.deleteStudyGoal(studyGoalId);
      setStudyGoals(prev => prev.filter(goal => goal._id !== studyGoalId));
    } catch (err) {
      console.error('Error deleting study goal:', err);
      setError('Error al eliminar el objetivo de estudio');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter study goals based on active status and category
  const filteredStudyGoals = studyGoals.filter(goal => {
    // Filter by active status
    if (activeFilter !== null && goal.isActive !== activeFilter) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter && goal.categoryId !== categoryFilter) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Sin categoría';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  if (isLoading && !categoriesLoaded && !goalsLoaded) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="admin-study-goals">
      <div className="page-header">
        <h1 className="page-title">Gestión de Objetivos de Estudio</h1>
        <p className="page-description">
          Administra los objetivos de estudio disponibles para los estudiantes en la plataforma.
        </p>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button 
            onClick={() => fetchData()} 
            className="reload-button"
            style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            <i className="fas fa-sync-alt" style={{ marginRight: '5px' }}></i> Reintentar
          </button>
        </div>
      )}

      <div className="study-goals-actions">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="categoryFilter" className="filter-label">Categoría:</label>
            <select 
              id="categoryFilter" 
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="activeFilter" className="filter-label">Estado:</label>
            <select 
              id="activeFilter" 
              className="filter-select"
              value={activeFilter === null ? '' : activeFilter ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                setActiveFilter(value === '' ? null : value === 'active');
              }}
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
        
        <button className="create-button" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus-circle"></i>
          Nuevo Objetivo
        </button>
      </div>

      {(!isLoading && filteredStudyGoals.length === 0) ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="empty-title">No se encontraron objetivos de estudio</h3>
          <p className="empty-description">
            {categoryFilter || activeFilter !== null
              ? 'No hay objetivos de estudio que coincidan con los filtros seleccionados.'
              : 'No hay objetivos de estudio definidos aún. Crea el primero con el botón "Nuevo Objetivo".'}
          </p>
          {(categoryFilter || activeFilter !== null) && (
            <button 
              className="empty-action"
              onClick={() => {
                setCategoryFilter('');
                setActiveFilter(null);
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="study-goals-grid">
          {filteredStudyGoals.map(studyGoal => (
            <div key={studyGoal._id} className={`study-goal-card ${!studyGoal.isActive ? 'inactive' : ''}`}>
              <div className="study-goal-header">
                <h3 className="study-goal-name">{studyGoal.name}</h3>
                <span className={`study-goal-status ${studyGoal.isActive ? 'active' : 'inactive'}`}>
                  {studyGoal.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="study-goal-description">
                {studyGoal.description || 'Sin descripción'}
              </p>
              <div className="study-goal-category">
                <span className="category-badge">
                  <i className="fas fa-tag"></i>
                  {studyGoal.category ? studyGoal.category.name : getCategoryName(studyGoal.categoryId)}
                </span>
              </div>
              <div className="study-goal-meta">
                <div className="study-goal-dates">
                  <span className="date-item">
                    <i className="fas fa-calendar-alt"></i>
                    {formatDate(studyGoal.createdAt)}
                  </span>
                </div>
              </div>
              <div className="study-goal-actions">
                <button 
                  className="action-button edit" 
                  onClick={() => handleOpenEditModal(studyGoal)}
                  title="Editar objetivo"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="action-button delete" 
                  onClick={() => handleDeleteStudyGoal(studyGoal._id)}
                  title="Eliminar objetivo"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for create/edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="study-goal-modal">
            <div className="modal-header">
              <h2>{isCreateMode ? 'Crear Nuevo Objetivo' : 'Editar Objetivo'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="study-goal-form">
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre del Objetivo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                    placeholder="Ej: Álgebra Lineal, Programación en JavaScript..."
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
                    placeholder="Breve descripción del objetivo de estudio..."
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="categoryId" className="form-label">Categoría</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleFormChange}
                    className="form-input"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                    />
                    <span>Objetivo Activo</span>
                  </label>
                  <p className="help-text">
                    Los objetivos inactivos no serán visibles para los estudiantes.
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
                      ? 'Crear Objetivo' 
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