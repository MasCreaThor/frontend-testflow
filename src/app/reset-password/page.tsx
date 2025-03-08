//src/app/reset-password/request/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    if (token) {
      // Redirigir a la ruta correcta con el token
      router.push(`/password-reset/${token}`);
    } else {
      // Si no hay token, redirigir a la página de solicitud de restablecimiento
      router.push('/password-reset/request');
    }
  }, [token, router]);

  return (
    <div className="redirect-container">
      <p>Redirigiendo...</p>
    </div>
  );
}