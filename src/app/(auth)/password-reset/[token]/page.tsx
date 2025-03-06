'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import '@/styles/auth.css';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;

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