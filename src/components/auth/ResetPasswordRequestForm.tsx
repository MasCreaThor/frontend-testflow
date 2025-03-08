// src/components/auth/ResetPasswordRequestForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import useAuthStore from '@/store/auth.store';
import '@/styles/resetPassword.css';

// Esquema de validación para el formulario de solicitud de reset
const resetRequestSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Dirección de email inválida')
});

type ResetRequestFormValues = z.infer<typeof resetRequestSchema>;

export default function ResetPasswordRequestForm() {
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetRequestFormValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ResetRequestFormValues) => {
    clearError();
    setSubmittedEmail(data.email);
    const success = await requestPasswordReset({ email: data.email });
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-content">
          <div className="reset-success">
            <div className="success-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h2 className="success-title">Verifica tu correo electrónico</h2>
            <p className="success-message">
              Si existe una cuenta asociada a <strong>{submittedEmail}</strong>, 
              enviaremos un correo electrónico con instrucciones para restablecer tu contraseña.
            </p>
            <p className="success-note">Si no recibes el correo en unos minutos, verifica tu carpeta de spam.</p>
            <div className="form-actions">
              <Link href="/login" className="back-button">
                <i className="fas fa-arrow-left button-icon-left"></i>
                Volver a inicio de sesión
              </Link>
            </div>
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
              <i className="fas fa-key"></i>
            </div>
            <h2 className="form-title">Recuperar contraseña</h2>
            <p className="form-subtitle">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="reset-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <div className="input-with-icon">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
                <i className="fas fa-paper-plane button-icon"></i>
              </button>
              
              <Link href="/login" className="back-link">
                <i className="fas fa-arrow-left button-icon-left"></i>
                Volver a inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}