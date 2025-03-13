// src/components/profile/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useProfile from '@/hooks/useProfile';
import ProfileImage from './ProfileImage';
import '@/styles/profile.css';

// Esquema de validación para el formulario de perfil
const profileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { profile, isLoading, error, updateUserProfile, clearError } = useProfile();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || ''
    }
  });

  // Actualizar el formulario cuando se carga el perfil
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    clearError();
    setUpdateSuccess(false);
    
    const success = await updateUserProfile(data);
    
    if (success) {
      setUpdateSuccess(true);
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="profile-form-section">
      <h2 className="section-title">Información Personal</h2>
      
      <div className="profile-card">
        <ProfileImage />
        
        <div className="profile-info">
          <h3 className="profile-name">
            {profile?.firstName} {profile?.lastName}
          </h3>
          {profile?.userId && (
            <p className="profile-id">ID: {profile.userId}</p>
          )}
        </div>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      {updateSuccess && <div className="form-success">Perfil actualizado correctamente</div>}
      
      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">Nombre</label>
            <input 
              id="firstName"
              type="text" 
              className={`form-input ${errors.firstName ? 'input-error' : ''}`}
              placeholder="Tu nombre"
              {...register('firstName')}
            />
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Apellido</label>
            <input 
              id="lastName"
              type="text" 
              className={`form-input ${errors.lastName ? 'input-error' : ''}`}
              placeholder="Tu apellido"
              {...register('lastName')}
            />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;