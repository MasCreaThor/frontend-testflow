'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/auth.css';

export default function PasswordRecovery() {
  return (
    // aqui se debe implementar la interfaz de login de usuario funcional.
    <div className="auth-page">
      <div className="auth-container">
        <div className="login-form-container">
          <div className="forgot-password">
            <Link href="/password-reset/request" className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
