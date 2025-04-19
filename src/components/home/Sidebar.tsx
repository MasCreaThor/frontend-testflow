"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Settings, 
  HelpCircle, 
  Bell
} from 'lucide-react';

const Sidebar = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const triggerAreaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Configuración', href: '/settings', icon: Settings },
    { name: 'Ayuda', href: '/help', icon: HelpCircle },
    { name: 'Notificaciones', href: '/notifications', icon: Bell },
  ];

  // Función para mostrar el sidebar
  const openSidebar = () => {
    setIsOpen(true);
  };

  // Función para ocultar el sidebar
  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Prevenir que el sidebar se cierre cuando el cursor está sobre él
    const handleSidebarMouseEnter = () => {
      setIsOpen(true);
    };

    const handleSidebarMouseLeave = () => {
      setIsOpen(false);
    };

    // Agregar event listeners
    const sidebarElement = sidebarRef.current;
    const triggerElement = triggerAreaRef.current;

    if (sidebarElement) {
      sidebarElement.addEventListener('mouseenter', handleSidebarMouseEnter);
      sidebarElement.addEventListener('mouseleave', handleSidebarMouseLeave);
    }

    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', openSidebar);
    }

    // Limpiar event listeners cuando el componente se desmonte
    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('mouseenter', handleSidebarMouseEnter);
        sidebarElement.removeEventListener('mouseleave', handleSidebarMouseLeave);
      }
      
      if (triggerElement) {
        triggerElement.removeEventListener('mouseenter', openSidebar);
      }
    };
  }, []);

  return (
    <>
      {/* Área de activación en el borde izquierdo */}
      <div 
        ref={triggerAreaRef}
        className="fixed top-0 left-0 w-3 h-full z-20"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-95'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mi Aplicación</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Usuario</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ver perfil</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;