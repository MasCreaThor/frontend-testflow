import React, { useState } from 'react';
import { BookOpen, Brain, Zap, Clock, Gift, Users } from 'lucide-react';

interface ProductCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ icon: Icon, title, description, color, hoverColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 transform ${isHovered ? 'scale-105 -translate-y-2' : ''}`}
      style={{ 
        backgroundColor: isHovered ? hoverColor : color,
        height: '300px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo animado */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-500" 
        style={{ 
          background: `radial-gradient(circle at ${isHovered ? '40% 40%' : '60% 60%'}, white, transparent 70%)`,
          opacity: isHovered ? 0.2 : 0.1,
          transform: `scale(${isHovered ? 1.2 : 1})`,
          transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
        }}
      />
      
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Contenido */}
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        <div className="transition-transform duration-500" style={{ transform: isHovered ? 'translateY(-5px)' : '' }}>
          <div className={`p-3 w-16 h-16 rounded-lg mb-4 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-white text-black scale-110' : 'bg-white/20 text-white'}`}>
            <Icon width={30} height={30} className="transition-all duration-300" style={{ strokeWidth: isHovered ? 2.5 : 2 }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300" style={{ transform: isHovered ? 'translateY(-2px)' : '' }}>
            {title}
          </h3>
          <p className="text-white/80 transition-all duration-500" style={{ maxWidth: '280px', display: isHovered ? 'block' : '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
        <div className={`bg-white/20 rounded-lg py-2 px-3 self-start text-sm text-white font-medium transition-all duration-300 ${isHovered ? 'bg-white/30 translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Explorar
        </div>
      </div>
    </div>
  );
};

const ProductShowcase = () => {
  const products = [
    {
      icon: BookOpen,
      title: "Guías de Estudio",
      description: "Accede a guías interactivas personalizadas que se adaptan a tu estilo de aprendizaje y te ayudan a dominar cualquier tema paso a paso.",
      color: "#4F46E5", // Indigo
      hoverColor: "#4338CA"
    },
    {
      icon: Brain,
      title: "Práctica Inteligente",
      description: "Ejercicios que evolucionan según tu progreso, enfocándose en las áreas donde necesitas más apoyo para maximizar tu tiempo de estudio.",
      color: "#8B5CF6", // Violet
      hoverColor: "#7C3AED"
    },
    {
      icon: Zap,
      title: "Retos Diarios",
      description: "Desafíos rápidos y divertidos que refuerzan lo aprendido y mantienen tu motivación mediante técnicas de gamificación.",
      color: "#EC4899", // Pink
      hoverColor: "#DB2777"
    },
    {
      icon: Clock,
      title: "Planificador de Estudio",
      description: "Organiza tu tiempo con calendarios inteligentes que se ajustan a tus objetivos y te ayudan a establecer hábitos de estudio efectivos.",
      color: "#10B981", // Emerald
      hoverColor: "#059669"
    },
    {
      icon: Gift,
      title: "Recompensas",
      description: "Sistema de incentivos que premia tu constancia y logros académicos con beneficios exclusivos dentro de la plataforma.",
      color: "#F59E0B", // Amber
      hoverColor: "#D97706"
    },
    {
      icon: Users,
      title: "Grupos de Estudio",
      description: "Conecta con otros estudiantes, comparte recursos y participa en sesiones colaborativas para enriquecer tu experiencia de aprendizaje.",
      color: "#EF4444", // Red
      hoverColor: "#DC2626"
    }
  ];

  return (
    <div className="w-full py-12 bg-gray-900">
      <h2 className="text-4xl font-bold text-center text-white mb-4">
        Descubre TestFlow
      </h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        Una plataforma diseñada para transformar tu forma de estudiar con herramientas innovadoras
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;