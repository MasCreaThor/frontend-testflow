// src/components/auth/RegisterForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth.store';
import '@/styles/auth.css';

// Esquema de validación para el formulario de registro
const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Dirección de email inválida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    const success = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    });
    
    if (success) {
      router.push('/dashboard');
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-branding">
          <h1 className="branding-title">TestFlow</h1>
          <p className="branding-subtitle">Únete hoy y transforma tu forma de estudiar.</p>
          
          <div className="branding-features">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Crea tu cuenta</p>
                <p className="feature-subtitle">Personaliza tu perfil</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-file-upload"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Sube materiales</p>
                <p className="feature-subtitle">PDF, documentos, notas</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="feature-text">
                <p className="feature-title">Estudia mejor</p>
                <p className="feature-subtitle">Con preguntas personalizadas</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="register-form-container">
          <div className="form-header">
            <div className="form-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h1 className="form-title">Crear tu cuenta</h1>
            <p className="form-subtitle">¡Comienza tu viaje de aprendizaje inteligente!</p>
          </div>
          
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}></div>
          </div>
          
          {error && <div className="form-error">{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {step === 1 && (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">Nombre</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user input-icon"></i>
                      <input 
                        id="firstName"
                        type="text" 
                        className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="Nombre"
                        {...register('firstName')}
                      />
                    </div>
                    {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Apellido</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user input-icon"></i>
                      <input 
                        id="lastName"
                        type="text" 
                        className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Apellido"
                        {...register('lastName')}
                      />
                    </div>
                    {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                  </div>
                </div>
                
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
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock input-icon"></i>
                      <input 
                        id="password"
                        type="password" 
                        className={`form-input ${errors.password ? 'input-error' : ''}`}
                        placeholder="Mínimo 6 caracteres"
                        {...register('password')}
                      />
                    </div>
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock input-icon"></i>
                      <input 
                        id="confirmPassword"
                        type="password" 
                        className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Repite tu contraseña"
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </>
            )}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || !isValid}
              >
                {isLoading ? 'Registrando...' : 'Crear cuenta'}
                <i className="fas fa-arrow-right button-icon"></i>
              </button>
            </div>
          </form>
          
          <div className="form-footer">
            <span className="footer-text">¿Ya tienes una cuenta?</span>
            <Link href="/auth/login" className="footer-link">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}