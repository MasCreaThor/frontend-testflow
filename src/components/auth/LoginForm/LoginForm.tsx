// src/components/auth/LoginForm/LoginForm.tsx - Versión con tracking
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useFormTracking, useSentryTracking } from '@/hooks/useSentryTracking';
import { LoginRequest } from '@/types/auth.types';

/**
 * Login form component with Sentry tracking
 */
const LoginForm: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sentry tracking hooks
  const { trackEvent, trackFeatureUsage } = useSentryTracking();
  const {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFormSuccess,
  } = useFormTracking('login-form');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart();
    trackFeatureUsage('login-form-view');
  }, [trackFormStart, trackFeatureUsage]);

  // Track field interactions
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  useEffect(() => {
    if (watchedEmail) {
      trackEvent('Login Form - Email Entered', {
        hasEmail: !!watchedEmail,
        emailLength: watchedEmail.length,
      });
    }
  }, [watchedEmail, trackEvent]);

  useEffect(() => {
    if (watchedPassword) {
      trackEvent('Login Form - Password Entered', {
        hasPassword: !!watchedPassword,
        passwordLength: watchedPassword.length,
      });
    }
  }, [watchedPassword, trackEvent]);
  
  const onSubmit = async (data: LoginRequest) => {
    clearError();
    setIsSubmitting(true);
    
    // Track form submission attempt
    trackFormSubmit({
      email: data.email,
      hasRememberMe: false, // Si tienes checkbox de remember me
    });
    
    try {
      const startTime = Date.now();
      await login(data);
      
      // Track successful login
      const duration = Date.now() - startTime;
      trackFormSuccess({
        duration,
        email: data.email,
      });
      
      trackFeatureUsage('successful-login');
      trackEvent('User Logged In Successfully', {
        duration,
        email: data.email,
      });
      
    } catch (err: any) {
      // Track login error
      trackFormError(err.message || 'Login failed', 'general');
      trackEvent('Login Failed', {
        error: err.message,
        email: data.email,
      }, 'error');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track link clicks
  const handleForgotPasswordClick = () => {
    trackEvent('Forgot Password Link Clicked');
    trackFeatureUsage('forgot-password-link');
  };

  const handleRegisterLinkClick = () => {
    trackEvent('Register Link Clicked');
    trackFeatureUsage('register-link');
  };

  // Track error display
  useEffect(() => {
    if (error) {
      trackEvent('Login Error Displayed', {
        error,
      }, 'error');
    }
  }, [error, trackEvent]);
  
  return (
    <form 
      className="space-y-6" 
      onSubmit={handleSubmit(onSubmit)}
      name="login-form"
      data-track="login-form"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      <Input
        label="Email"
        type="email"
        id="email"
        autoComplete="email"
        error={errors.email?.message}
        data-track="email-input"
        {...register('email', {
          required: 'El email es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido',
          },
        })}
      />
      
      <Input
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="current-password"
        error={errors.password?.message}
        data-track="password-input"
        {...register('password', {
          required: 'La contraseña es requerida',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        })}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            data-track="remember-me-checkbox"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Recordarme
          </label>
        </div>
        
        <div className="text-sm">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-500"
            onClick={handleForgotPasswordClick}
            data-track="forgot-password-link"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
          data-track="login-submit-button"
        >
          Iniciar Sesión
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-500"
            onClick={handleRegisterLinkClick}
            data-track="register-link"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;