// src/components/auth/ResetPasswordForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import '@/styles/resetPassword.css';

// Esquema de validación para el formulario de cambio de contraseña
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'La confirmación de contraseña es requerida' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    clearError();
    const success = await resetPassword({
      token,
      newPassword: data.password
    });
    
    if (success) {
      setResetSuccess(true);
      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (resetSuccess) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-content">
          <div className="reset-success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="success-title">¡Contraseña actualizada!</h2>
            <p className="success-message">Tu contraseña ha sido actualizada correctamente.</p>
            <p className="success-note">Serás redirigido a la página de inicio de sesión en unos segundos...</p>
            <Link href="/login" className="login-button">
              Ir a inicio de sesión
              <i className="fas fa-arrow-right button-icon"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-content">
        <div className="reset-form-container">
          <div className="form-header">
            <div className="form-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="form-title">Establece una nueva contraseña</h2>
            <p className="form-subtitle">
              Crea una nueva contraseña segura para tu cuenta.
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="reset-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Nueva contraseña
              </label>
              <div className="input-with-icon">
                <i className="fas fa-lock input-icon"></i>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Ingresa tu nueva contraseña"
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <div className="input-with-icon">
                <i className="fas fa-lock input-icon"></i>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirma tu nueva contraseña"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="password-strength">
              <p className="strength-label">Recomendaciones de seguridad:</p>
              <ul className="strength-tips">
                <li>Utiliza al menos 8 caracteres</li>
                <li>Combina letras mayúsculas y minúsculas</li>
                <li>Incluye números y símbolos</li>
              </ul>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                <i className="fas fa-save button-icon"></i>
              </button>
              <Link href="/auth/login" className="back-link">
                Volver a inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}