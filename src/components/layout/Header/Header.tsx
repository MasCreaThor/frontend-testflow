'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedNav, UnauthenticatedNav } from '../Navigation';

interface HeaderProps {
  /** 
   * If true, the header is being rendered in the dashboard layout.
   * In dashboard layout, we don't need to show navigation components.
   */
  inDashboard?: boolean;
}

/**
 * Header component for the application
 */
const Header: React.FC<HeaderProps> = ({ inDashboard = false }) => {
  const { isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              aria-label="TestFlow Home"
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TF</span>
                </div>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                TestFlow
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Only show when not in dashboard */}
          {!inDashboard && (
            <div className="hidden md:flex md:items-center">
              {isLoggedIn ? <AuthenticatedNav /> : <UnauthenticatedNav />}
            </div>
          )}
          
          {/* Mobile menu button - Only show when not in dashboard */}
          {!inDashboard && (
            <div className="md:hidden flex">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">
                  {isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                </span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* User info when in dashboard - only on larger screens */}
          {inDashboard && (
            <div className="hidden sm:flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Dashboard
              </span>
            </div>
          )}
        </div>
        
        {/* Mobile menu - Only show when not in dashboard */}
        {!inDashboard && (
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    Mi espacio de estudio
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/study-goals"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    Objetivos de Estudio
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    Inicio
                  </Link>
                  <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                      <Link
                        href="/auth/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={closeMenu}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                        onClick={closeMenu}
                      >
                        Registrarse
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;