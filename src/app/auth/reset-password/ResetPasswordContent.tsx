'use client';

import React, { useEffect, useState } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm/ResetPasswordForm';
import Card from '@/components/ui/Card/Card';
import Link from 'next/link';

/**
 * Contenido de la página de restablecimiento de contraseña
 * Versión corregida que no usa useSearchParams directamente
 */
export default function ResetPasswordContent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Obtener el token de manera segura solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      setToken(urlToken);
      setIsLoading(false);
      
      if (urlToken) {
        console.log('Token de restablecimiento recibido en URL');
      } else {
        console.log('No se encontró token en los parámetros de URL');
      }
    }
  }, []);
  
  // Mostrar loading mientras se obtiene el token
  if (isLoading) {
    return (
      <Card>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </Card>
    );
  }
  
  // Check if token exists in URL
  if (!token) {
    return (
      <Card>
        <div className="text-center p-4">
          <div className="text-red-500 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Enlace inválido o expirado
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            El enlace para restablecer la contraseña es inválido o ha expirado.
            Por favor, solicita un nuevo enlace de restablecimiento.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </Card>
    );
  }
  
  return <ResetPasswordForm token={token} />;
}