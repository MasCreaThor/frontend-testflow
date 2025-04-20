'use client';

import React, { useState } from 'react';
import { Settings, Palette, Bell, Shield } from 'lucide-react';
import Header from '@/components/home/Header';
import Link from 'next/link';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ReactNode;
}

const SettingsPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedSection, setSelectedSection] = useState('general');

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' }
  ];

  const settingSections: SettingOption[] = [
    {
      id: 'general',
      title: 'Configuración General',
      description: 'Ajustes generales de la aplicación',
      icon: Settings,
      component: (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Idioma</h3>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      title: 'Apariencia',
      description: 'Personaliza la apariencia de la aplicación',
      icon: Palette,
      component: (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Tema</h3>
            <div className="flex items-center justify-between">
              <span>Modo oscuro</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Configura tus preferencias de notificaciones',
      icon: Bell,
      component: (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Preferencias de notificaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notificaciones push</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${notifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      description: 'Gestiona tu privacidad y seguridad',
      icon: Shield,
      component: (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Configuración de privacidad</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Compartir datos de uso</span>
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link 
            href="/" 
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span className="font-medium">Volver a la página principal</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de navegación */}
          <div className="w-full md:w-64 space-y-1">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${selectedSection === section.id ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <section.icon className="h-5 w-5" />
                <div className="flex flex-col text-left">
                  <span className="font-medium">{section.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{section.description}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Área de contenido */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                {settingSections.find(section => section.id === selectedSection)?.component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;