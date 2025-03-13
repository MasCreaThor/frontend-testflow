// src/components/profile/PasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import '@/styles/profile.css';

// Configuración base para axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Esquema de validación para el cambio de contraseña
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setUpdateSuccess(false);
    setDebugInfo(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No se ha iniciado sesión');
      }
      
      setDebugInfo(`Token obtenido: ${token.substring(0, 15)}...`);
      
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setDebugInfo(prev => `${prev || ''}\nRespuesta: ${JSON.stringify(response.data)}`);
      
      // Éxito - limpiar formulario
      reset();
      setUpdateSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Error al cambiar la contraseña';
        setError(errorMessage);
        setDebugInfo(prev => `${prev || ''}\nError: ${JSON.stringify(err.response?.data || err.message)}`);
      } else {
        setError('Error al conectar con el servidor');
        setDebugInfo(prev => `${prev || ''}\nError desconocido: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-form-section">
      <h2 className="section-title">Seguridad</h2>
      
      {error && <div className="form-error">{error}</div>}
      {updateSuccess && <div className="form-success">Contraseña actualizada correctamente</div>}
      {/* {debugInfo && <pre className="debug-info">{debugInfo}</pre>} */}
      
      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
          <input 
            id="currentPassword"
            type="password" 
            className={`form-input ${errors.currentPassword ? 'input-error' : ''}`}
            placeholder="Ingresa tu contraseña actual"
            {...register('currentPassword')}
          />
          {errors.currentPassword && <p className="error-message">{errors.currentPassword.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input 
            id="newPassword"
            type="password" 
            className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
            placeholder="Ingresa tu nueva contraseña"
            {...register('newPassword')}
          />
          {errors.newPassword && <p className="error-message">{errors.newPassword.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
          <input 
            id="confirmPassword"
            type="password" 
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirma tu nueva contraseña"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <div className="password-strength-info">
          <h4 className="password-strength-title">Recomendaciones de seguridad:</h4>
          <ul className="password-strength-tips">
            <li>Usa al menos 8 caracteres</li>
            <li>Combina letras mayúsculas y minúsculas</li>
            <li>Incluye números y símbolos</li>
            <li>No uses información personal fácil de adivinar</li>
          </ul>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;