'use client';

import React, { ReactNode } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { DashboardLayoutProvider, useDashboardLayout } from '@/contexts/DashboardLayoutContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Inner component that uses the dashboard layout context
 */
const DashboardLayoutInner: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { 
    isSidebarCollapsed, 
    isMobileMenuOpen, 
    toggleSidebar, 
    closeMobileMenu 
  } = useDashboardLayout();
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <Header inDashboard={true} />
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className={`h-full fixed transition-all duration-300 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}>
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={toggleSidebar}
              isMobile={false}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Mobile Sidebar */}
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-900 z-30 lg:hidden transform transition-transform duration-300 ease-in-out">
              <Sidebar 
                isCollapsed={false}
                isMobile={true}
                onCloseMobile={closeMobileMenu}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
          <div className="py-6">
            {/* Toggle Sidebar Button - Mobile */}
            <div className="px-4 sm:px-6 lg:px-8 mb-4 lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={toggleSidebar}
                aria-label="Abrir menú de navegación"
              >
                <span className="sr-only">Abrir menú</span>
                <svg
                  className="h-6 w-6"
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
              </button>
            </div>

            {/* Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

/**
 * Dashboard layout with sidebar for authenticated pages
 * Wraps children with the DashboardLayoutProvider
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <DashboardLayoutProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardLayoutProvider>
  );
};

export default DashboardLayout;