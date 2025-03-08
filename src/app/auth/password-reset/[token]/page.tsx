// Usamos la directiva 'use client' para asegurarnos de que Next.js trate esto como un componente de cliente
'use client';

import { useParams } from 'next/navigation';
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import "@/styles/auth.css";
import { useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Extraemos el token de los parámetros de ruta
    if (params && params.token) {
      // params.token puede ser un string o un array, manejamos ambos casos
      setToken(Array.isArray(params.token) ? params.token[0] : params.token);
    }
  }, [params]);

  // Mostramos un estado de carga mientras verificamos el token
  if (token === null) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  // Verificamos si el token es válido
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="error-container">
            <h2>Token inválido</h2>
            <p>El enlace que estás utilizando no es válido o ha expirado.</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizamos el formulario si el token es válido
  return (
    <div className="auth-page">
      <div className="auth-container">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}