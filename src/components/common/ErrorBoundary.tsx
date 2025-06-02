// src/components/common/ErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capturar información adicional del contexto
    const userAgent = navigator.userAgent;
    const currentUrl = window.location.href;
    const timestamp = new Date().toISOString();
    
    // Obtener información del usuario si está disponible
    let userContext = {};
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        userContext = {
          hasToken: true,
          tokenExists: true,
        };
      }
    } catch (e) {
      // Ignorar errores al acceder localStorage
    }

    // Establecer contexto para Sentry
    Sentry.setContext('errorBoundary', {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      timestamp,
      url: currentUrl,
      userAgent,
    });

    Sentry.setContext('user', userContext);

    // Agregar breadcrumb del error
    Sentry.addBreadcrumb({
      category: 'error',
      message: 'Error caught by ErrorBoundary',
      level: 'error',
      data: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });

    // Capturar el error en Sentry y obtener el ID del evento
    const errorId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        component: 'ErrorBoundary',
        section: 'ui',
      },
    });

    // Actualizar estado con el ID del error
    this.setState({ errorId });

    // Llamar callback personalizado si se proporciona
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    // Agregar breadcrumb de retry
    Sentry.addBreadcrumb({
      category: 'ui.click',
      message: 'User clicked retry button',
      level: 'info',
    });

    // Reset del error boundary
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  handleReportIssue = () => {
    // Agregar breadcrumb de reporte
    Sentry.addBreadcrumb({
      category: 'ui.click',
      message: 'User clicked report issue button',
      level: 'info',
    });

    // Abrir dialog de Sentry para feedback del usuario
    if (this.state.errorId) {
      Sentry.showReportDialog({
        eventId: this.state.errorId,
        user: {
          email: '',
          name: '',
        },
        lang: 'es',
        title: 'Reportar un problema',
        subtitle: 'Ayúdanos a mejorar reportando este error.',
        subtitle2: 'Tu reporte nos ayudará a solucionarlo más rápido.',
        labelName: 'Nombre',
        labelEmail: 'Email',
        labelComments: 'Qué pasó?',
        labelSubmit: 'Enviar Reporte',
        errorGeneric: 'Ocurrió un error desconocido. Por favor, inténtalo de nuevo.',
        errorFormEntry: 'Algunos campos no son válidos. Por favor, corrígelos e inténtalo de nuevo.',
        successMessage: '¡Gracias! Tu reporte ha sido enviado.',
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI de error por defecto
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  ¡Ups! Algo salió mal
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Detalles del error (solo en desarrollo)
                    </summary>
                    <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto">
                      {this.state.error.message}
                      {'\n\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={this.handleRetry} variant="primary">
                    Intentar de nuevo
                  </Button>
                  
                  <Button onClick={this.handleReportIssue} variant="outline">
                    Reportar problema
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                  >
                    Ir al inicio
                  </Button>
                </div>
                
                {this.state.errorId && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    ID del error: {this.state.errorId}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;