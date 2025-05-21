'use client';

import React, { Suspense } from 'react';
import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import Card from '@/components/ui/Card/Card';
import Link from 'next/link';

// Componente cliente que usa useSearchParams
const ResetPasswordContent = React.lazy(() => import('./ResetPasswordContent'));

// Componente de carga durante la suspensión
const LoadingFallback = () => (
  <Card>
    <div className="text-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
    </div>
  </Card>
);

/**
 * Reset password page - Con Suspense para useSearchParams
 */
export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Restablecer contraseña" 
      subtitle="Crea una nueva contraseña para tu cuenta"
    >
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}