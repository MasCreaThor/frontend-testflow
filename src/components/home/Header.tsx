import Link from 'next/link';
import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm p-4 rounded-lg mb-4 flex items-center justify-between">
      {/* Lado izquierdo */}
      <div className="flex items-center space-x-4">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg font-bold text-sm">TF</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            TestFlow
          </h1>
        </Link>
      </div>
      
      {/* Centro - Opcional: Barra de búsqueda */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>
      
      {/* Lado derecho */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </div>
        
        <div className="hidden sm:flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors">
            <Link href="/auth/login">Iniciar sesión</Link>
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors">
            <Link href="/auth/register">Registrarse</Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;