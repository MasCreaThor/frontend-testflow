// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import SimpleSentryProvider from '@/components/common/SimpleSentryProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'TestFlow - Plataforma Educativa',
  description: 'Plataforma para la gestión de aprendizaje y evaluación de conocimientos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <ErrorBoundary>
          <AuthProvider>
            <SimpleSentryProvider>
              {children}
            </SimpleSentryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}