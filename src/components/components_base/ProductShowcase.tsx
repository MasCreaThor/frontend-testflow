import React, { useState } from 'react';
import { BookOpen, Brain, Zap, Clock, Gift, Users, LucideProps } from 'lucide-react';
// Componente Modal
import Modal from '@/components/components_base/Modal/Modal';
// Imports de Redux
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

interface ProductCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ icon: Icon, title, description, color, hoverColor, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Obtenemos el tema desde Redux
  const theme = useAppSelector(state => state.ui.theme);
  
  // Ajustamos colores según el tema si es necesario
  const cardBgColor = isHovered ? hoverColor : color;
  const textColor = 'text-white'; // Mantenemos texto blanco para contraste con fondos de colores
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 transform ${isHovered ? 'scale-105 -translate-y-2' : ''} cursor-pointer`}
      style={{ 
        backgroundColor: cardBgColor,
        height: '300px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* El resto del código de la tarjeta es igual */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-500" 
        style={{ 
          background: `radial-gradient(circle at ${isHovered ? '40% 40%' : '60% 60%'}, white, transparent 70%)`,
          opacity: isHovered ? 0.2 : 0.1,
          transform: `scale(${isHovered ? 1.2 : 1})`,
          transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
        }}
      />
      
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
  // Redux
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.ui.theme);
  const appInfo = useAppSelector(state => state.ui.appInfo);
  
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null);

  // Usando el modalId para potencialmente rastrear el estado del modal en Redux
  const modalId = "product-detail-modal";

  // Lista de productos
  const products = [
    {
      icon: BookOpen,
      title: "Guías de Estudio",
      description: "Accede a guías interactivas personalizadas que se adaptan a tu estilo de aprendizaje y te ayudan a dominar cualquier tema paso a paso.",
      color: "#4F46E5", // Indigo
      hoverColor: "#4338CA",
      longDescription: "Las guías de estudio interactivas te ofrecen un camino personalizado para dominar cualquier materia. Utilizamos algoritmos de aprendizaje adaptativo que ajustan el contenido según tu ritmo y estilo de aprendizaje. Cada guía incluye explicaciones claras, ejemplos prácticos, y ejercicios interactivos que refuerzan conceptos clave. Puedes establecer tus propias metas, marcar secciones para revisión posterior y recibir recomendaciones personalizadas basadas en tu progreso."
    },
    {
      icon: Brain,
      title: "Práctica Inteligente",
      description: "Ejercicios que evolucionan según tu progreso, enfocándose en las áreas donde necesitas más apoyo para maximizar tu tiempo de estudio.",
      color: "#8B5CF6", // Violet
      hoverColor: "#7C3AED",
      longDescription: "Nuestro sistema de práctica inteligente analiza tu desempeño en tiempo real para identificar áreas de mejora y fortaleza. A diferencia de métodos tradicionales que repiten los mismos ejercicios, nuestro algoritmo ajusta la dificultad y el enfoque temático según tus necesidades específicas. Esto optimiza tu tiempo de estudio dirigiendo la atención hacia conceptos que requieren refuerzo, mientras consolida lo que ya dominas. Incluye retroalimentación detallada y sugerencias para mejorar tu comprensión en cada tema."
    },
    {
      icon: Zap,
      title: "Retos Diarios",
      description: "Desafíos rápidos y divertidos que refuerzan lo aprendido y mantienen tu motivación mediante técnicas de gamificación.",
      color: "#EC4899", // Pink
      hoverColor: "#DB2777",
      longDescription: "Los retos diarios son desafíos cortos y emocionantes diseñados para mantener tu motivación y crear un hábito de estudio consistente. Cada día recibirás un nuevo conjunto de actividades personalizadas que refuerzan lo aprendido previamente y te introducen a nuevos conceptos. El sistema de gamificación incluye puntos, insignias y tablas de clasificación para comparar tu progreso con otros estudiantes. Los retos están diseñados para completarse en 5-15 minutos, haciéndolos perfectos para mantener tu racha de aprendizaje incluso en días ocupados."
    },
    {
      icon: Clock,
      title: "Planificador de Estudio",
      description: "Organiza tu tiempo con calendarios inteligentes que se ajustan a tus objetivos y te ayudan a establecer hábitos de estudio efectivos.",
      color: "#10B981", // Emerald
      hoverColor: "#059669",
      longDescription: "El planificador de estudio inteligente te ayuda a optimizar tu tiempo y desarrollar hábitos de estudio efectivos. La herramienta analiza tus patrones de productividad, disponibilidad horaria y objetivos académicos para crear un plan personalizado. Te permite visualizar tu progreso, establecer recordatorios, y ajustar automáticamente tu calendario cuando surgen imprevistos. El sistema también identifica tus mejores horarios de concentración y sugiere bloques de estudio intensivo para maximizar la retención de información, alternando con periodos de descanso para un aprendizaje óptimo."
    },
    {
      icon: Gift,
      title: "Recompensas",
      description: "Sistema de incentivos que premia tu constancia y logros académicos con beneficios exclusivos dentro de la plataforma.",
      color: "#F59E0B", // Amber
      hoverColor: "#D97706",
      longDescription: "Nuestro sistema de recompensas está diseñado para mantener tu motivación a largo plazo reconociendo tu dedicación y logros. Ganarás puntos por completar actividades, mantener rachas de estudio y alcanzar objetivos personales. Estos puntos pueden canjearse por beneficios reales como acceso a contenido premium, plantillas exclusivas, y personalización avanzada de tu perfil. Las recompensas se estructuran para fomentar hábitos de estudio consistentes y celebrar tanto los pequeños avances diarios como los grandes logros académicos."
    },
    {
      icon: Users,
      title: "Grupos de Estudio",
      description: "Conecta con otros estudiantes, comparte recursos y participa en sesiones colaborativas para enriquecer tu experiencia de aprendizaje.",
      color: "#EF4444", // Red
      hoverColor: "#DC2626",
      longDescription: "Los grupos de estudio virtuales te permiten conectar con compañeros que comparten tus intereses académicos. Puedes unirte a comunidades existentes o crear tu propio grupo con herramientas para compartir recursos, organizar sesiones de estudio en tiempo real y colaborar en proyectos. La plataforma facilita discusiones estructuradas, resolución colaborativa de problemas y sesiones de repaso grupal. Los grupos cuentan con tableros de discusión, videollamadas integradas y sistemas para dividir tareas complejas. Aprenderás no solo del material, sino también de las perspectivas y conocimientos de tus compañeros."
    }
  ];

  // Función para abrir el modal con la información del producto seleccionado
  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    
    // Si quisiéramos manejar el estado del modal en Redux, podríamos usar:
    // dispatch({ type: 'ui/openModal', payload: modalId });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    
    // Si quisiéramos manejar el estado del modal en Redux, podríamos usar:
    // dispatch({ type: 'ui/closeModal', payload: modalId });
  };

  // Clases condicionales basadas en el tema
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const modalTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`w-full py-12 ${bgClass}`}>
      <h2 className={`text-4xl font-bold text-center ${textClass} mb-4`}>
        Descubre {appInfo.companyName}
      </h2>
      <p className={`text-center ${textSecondaryClass} max-w-2xl mx-auto mb-12`}>
        {appInfo.description}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            {...product} 
            onClick={() => openProductModal(product)} 
          />
        ))}
      </div>

      {/* Modal con integración Redux para theming */}
      {isModalOpen && selectedProduct && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title={selectedProduct.title}
          modalId={modalId} // Pasamos el ID para posible integración con Redux
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div 
                className="p-4 rounded-lg mr-4" 
                style={{ backgroundColor: selectedProduct.color }}
              >
                {React.createElement(selectedProduct.icon, { 
                  className: "text-white",
                  size: 28
                })}
              </div>
              <h3 className={`text-2xl font-bold ${textClass}`}>{selectedProduct.title}</h3>
            </div>
            
            <p className={modalTextClass}>{selectedProduct.longDescription}</p>
            
            <div className={`mt-8 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-semibold mb-2 ${textClass}`}>Características principales:</h4>
              <ul className={`list-disc pl-5 space-y-2 ${modalTextClass}`}>
                {/* Aquí podrías agregar características específicas para cada producto */}
                <li>Contenido personalizado según tu nivel</li>
                <li>Seguimiento detallado de tu progreso</li>
                <li>Interfaz intuitiva y fácil de usar</li>
                <li>Sincronización entre dispositivos</li>
              </ul>
            </div>
            
            <button 
              className="mt-8 py-2 px-6 rounded-lg text-white font-medium"
              style={{ backgroundColor: selectedProduct.color }}
            >
              Comenzar ahora
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductShowcase;