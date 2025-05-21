import { Bell, Menu, Moon, Search, Sun, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50'} shadow-sm p-4 rounded-lg mb-4 flex items-center justify-between transition-colors duration-200`}>
      {/* Lado izquierdo */}
      <div className="flex items-center space-x-4">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} hover:text-indigo-600 transition-colors`}
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
            className={`w-full py-2 pl-10 pr-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
          />
          <div className={`absolute left-3 top-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            <Search size={18} />
          </div>
        </div>
      </div>
      
      {/* Lado derecho */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors relative`}
          aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors relative`}>
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </div>
        
        <div className="hidden sm:flex space-x-2">
          <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} font-medium transition-colors`}>
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