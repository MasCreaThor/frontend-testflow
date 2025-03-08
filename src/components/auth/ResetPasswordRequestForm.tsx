// src/components/auth/ResetPasswordRequestForm.tsx
'use client'; // Marcar como Client Component

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  resetPasswordRequestSchema, 
  ResetPasswordRequestFormValues 
} from '@/lib/validations';
import useAuthStore from '@/store/auth.store';
import Link from 'next/link';

export default function ResetPasswordRequestForm() {
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ResetPasswordRequestFormValues) => {
    clearError();
    setSubmittedEmail(data.email);
    const success = await requestPasswordReset(data);
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="reset-password-success">
        <h2>Verifica tu correo electrónico</h2>
        <p>
          Si existe una cuenta asociada a <strong>{submittedEmail}</strong>, 
          enviaremos un correo electrónico con instrucciones para restablecer tu contraseña.
        </p>
        <p>Si no recibes el correo en unos minutos, verifica tu carpeta de spam.</p>
        <div className="form-actions">
          <Link href="/login" className="back-to-login">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-form-container">
      <h2>Recuperar contraseña</h2>
      <p className="form-description">
        Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="Ingresa tu correo electrónico"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
          <Link href="/login" className="back-to-login">
            Volver a inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
}