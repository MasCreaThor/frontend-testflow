// src/app/layout.tsx
import { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TestFlow - Aprende de forma inteligente',
  description: 'Aplicación de aprendizaje personalizado',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}