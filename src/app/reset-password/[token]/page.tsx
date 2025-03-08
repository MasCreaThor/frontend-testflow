// src/app/reset-password/[token]/page.tsx
'use client';

import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import '@/styles/auth.css';

export default function ResetPasswordPage({
  params
}: {
  params: { token: string }
}) {
  const { token } = params;

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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}