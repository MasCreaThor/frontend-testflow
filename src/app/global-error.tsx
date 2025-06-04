'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error handler para capturar errores de React en App Router
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Capturar el error en Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'global-error',
        section: 'app-router',
      },
      extra: {
        digest: error.digest,
        errorBoundary: 'global',
      },
    });
  }, [error]);

  return (
    <html>
      <body>
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
                
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Error global de la aplicación
                </h2>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={reset} variant="primary">
                    Intentar de nuevo
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                  >
                    Ir al inicio
                  </Button>
                </div>
                
                {error.digest && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}