// components/Modal/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnClickOutside?: boolean;
  className?: string;
  modalId?: string; // Identificador opcional para el modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnClickOutside = true,
  className = '',
  modalId,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  
  // Obtenemos el tema de Redux
  const theme = useAppSelector(state => state.ui.theme);
  
  // Clases condicionales basadas en el tema
  const bgColorClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const borderColorClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const closeButtonClass = theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600';
  
  // Manejar Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        // Si se proporcionó un ID de modal, podríamos despachar una acción
        if (modalId) {
          dispatch({ type: 'ui/closeModal', payload: modalId });
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, dispatch, modalId]);
  
  // Cierre por clic fuera del modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
      // Si se proporcionó un ID de modal, podríamos despachar una acción
      if (modalId) {
        dispatch({ type: 'ui/closeModal', payload: modalId });
      }
    }
  };
  
  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  // Manejar el botón de cierre
  const handleCloseClick = () => {
    onClose();
    // Si se proporcionó un ID de modal, podríamos despachar una acción
    if (modalId) {
      dispatch({ type: 'ui/closeModal', payload: modalId });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} ${bgColorClass} rounded-lg shadow-xl transform transition-all ${className}`}
        aria-modal="true"
        role="dialog"
      >
        {title && (
          <div className={`px-6 py-4 border-b ${borderColorClass}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                type="button"
                className={`${closeButtonClass} focus:outline-none`}
                onClick={handleCloseClick}
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="px-6 py-4">{children}</div>
        
        {/* Footer opcional */}
        {footer && (
          <div className={`px-6 py-4 border-t ${borderColorClass}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;