// src/app/reset-password/request/page.tsx
'use client';

import React from 'react';
import ResetPasswordRequestForm from '@/components/auth/ResetPasswordRequestForm';
import '@/styles/auth.css';

export default function RequestPasswordResetPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <ResetPasswordRequestForm />
      </div>
    </div>
  );
}