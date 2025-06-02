'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DashboardLayoutContextProps {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextProps>({
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

interface DashboardLayoutProviderProps {
  children: ReactNode;
}

/**
 * Provider component for dashboard layout context
 */
export const DashboardLayoutProvider: React.FC<DashboardLayoutProviderProps> = ({ children }) => {
  // State for sidebar collapse (desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Check local storage for saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Toggle sidebar collapsed state (desktop)
  const toggleSidebar = () => {
    // Check if we're on mobile
    if (window.innerWidth < 1024) {
      // On mobile, toggle the mobile menu instead
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      // On desktop, toggle collapse state
      const newState = !isSidebarCollapsed;
      setIsSidebarCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', String(newState));
    }
  };

  // Close sidebar (for desktop)
  const closeSidebar = () => {
    setIsSidebarCollapsed(true);
    localStorage.setItem('sidebarCollapsed', 'true');
  };

  // Open mobile menu
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <DashboardLayoutContext.Provider
      value={{
        isSidebarCollapsed,
        isMobileMenuOpen,
        toggleSidebar,
        closeSidebar,
        openMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </DashboardLayoutContext.Provider>
  );
};

/**
 * Hook to use dashboard layout context
 */
export const useDashboardLayout = () => useContext(DashboardLayoutContext);