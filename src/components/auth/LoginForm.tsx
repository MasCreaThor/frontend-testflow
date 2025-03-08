// src/components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import '@/styles/login.css';

// Esquema de validación para el formulario de login
const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Dirección de email inválida'),
  password: z.string().min(1, 'La contraseña es requerida'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    await login(data.email, data.password);
    
    // Verificamos si el login fue exitoso antes de redirigir
    if (useAuthStore.getState().isAuthenticated) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-branding">
          <h1 className="branding-title">TestFlow</h1>
          <p className="branding-subtitle">La forma inteligente de estudiar y reforzar tus conocimientos.</p>
          
          <div className="branding-features">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-book-reader"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Cuestionarios Inteligentes</p>
                <p className="feature-subtitle">Optimiza tu estudio</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Seguimiento de Progreso</p>
                <p className="feature-subtitle">Visualiza tu mejora</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Procesamiento de PDF</p>
                <p className="feature-subtitle">Genera preguntas automáticamente</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="form-header">
            <div className="form-icon">
              <i className="fas fa-user-circle"></i>
            </div>
            <h1 className="form-title">Iniciar Sesión</h1>
            <p className="form-subtitle">Accede a tu cuenta de TestFlow</p>
          </div>
          
          {error && <div className="form-error">{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  id="email"
                  type="email" 
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="tu@email.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
            
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <Link href="/auth/password-reset/request" className="forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="input-with-icon">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  id="password"
                  type="password" 
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Tu contraseña"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            
            <div className="form-checkbox">
              <input 
                type="checkbox" 
                id="rememberMe" 
                className="checkbox-input"
                {...register('rememberMe')} 
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Recordarme en este dispositivo
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
          
          <div className="form-separator">
            <span className="separator-text">o</span>
          </div>
          
          <button type="button" className="social-login-button">
            <i className="fab fa-google social-icon"></i>
            Continuar con Google
          </button>
          
          <div className="form-footer">
            <span className="footer-text">¿No tienes una cuenta?</span>
            <Link href="/auth/register" className="footer-link">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}