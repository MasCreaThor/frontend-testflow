'use client'; // Esta línea es crítica - marca el componente como Client Component

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/lib/validations';
import useAuthStore from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Usar 'next/navigation' en lugar de 'next/router'

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
      <div className="reset-success-container">
        <h2>¡Contraseña actualizada!</h2>
        <p>Tu contraseña ha sido actualizada correctamente.</p>
        <p>Serás redirigido a la página de inicio de sesión en unos segundos...</p>
        <Link href="/login" className="login-link">
          Ir a inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="reset-password-form-container">
      <h2>Establece una nueva contraseña</h2>
      <p className="form-description">
        Crea una nueva contraseña segura para tu cuenta.
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            placeholder="Ingresa tu nueva contraseña"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirma tu nueva contraseña"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
          <Link href="/login" className="back-to-login">
            Volver a inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
}