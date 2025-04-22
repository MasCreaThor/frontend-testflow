'use client';

import React from 'react';
import { BookOpen, TrendingUp, FileText, Link } from 'lucide-react';
import ButtonTestFlow from '@/components/components_base/Button/ButtonTestFlow';
import { Button } from '@heroui/react';
import App from '@/components/components_base/Navbar';
import Header from '@/components/components_base/Header/Header';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function AboutUs({ toggleSidebar, sidebarOpen }: HeaderProps) {
  return (
<>
<Header/>
<App />

{/* Contenedor principal */}
<div className="min-h-screen bg-indigo-600 flex flex-col md:flex-row">
      {/* Panel izquierdo - Información sobre la plataforma */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">TestFlow</h1>
        
        <p className="text-xl text-white/90 mb-12">
          La forma inteligente de estudiar y reforzar tus conocimientos.
        </p>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Cuestionarios Inteligentes</h3>
              <p className="text-white/80">Optimiza tu estudio con preguntas adaptadas a tu nivel</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Seguimiento de Progreso</h3>
              <p className="text-white/80">Visualiza tu mejora y conoce tus áreas de oportunidad</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Procesamiento de PDF</h3>
              <p className="text-white/80">Genera preguntas automáticamente a partir de tus documentos</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel derecho - Acerca de nosotros */}
      <div className="w-full md:w-1/2 bg-slate-100 p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-4">Acerca de Nosotros</h2>
          
          <p className="text-gray-600 text-center mb-8">
            Somos una plataforma educativa diseñada para transformar la forma en que aprendes y retienes información.
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Nuestra Misión</h3>
            <p className="text-gray-600">
              Facilitar el aprendizaje efectivo mediante tecnologías inteligentes que se adapten a las necesidades individuales de cada estudiante.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Nuestra Visión</h3>
            <p className="text-gray-600">
              Convertirnos en la herramienta de estudio preferida por estudiantes y profesionales que buscan maximizar su potencial de aprendizaje.
            </p>
          </div>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
            Conoce más sobre nuestro equipo
          </button>       
           <link rel="stylesheet" href="/" />
        </div>
        
      </div>
    
    </div>
    </>
    
  );
}