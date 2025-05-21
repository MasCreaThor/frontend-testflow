// components/Button/ButtonContainer.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import ButtonTestFlow from './ButtonTestFlow'; // Adjust the path as needed
import { ButtonProps } from '@heroui/react';

interface ButtonContainerProps extends ButtonProps {
  action?: string; // Nombre de la acción a despachar
  actionPayload?: any; // Payload opcional para la acción
  isLoading?: boolean; // Indicador opcional de estado de carga
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Manejador de clic opcional
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  action,
  actionPayload,
  isLoading: propIsLoading,
  onClick,
  ...buttonProps 
}) => {
  const dispatch = useAppDispatch();
  
  // Podemos obtener el estado de carga desde Redux si es necesario
  // Modificamos aquí para usar 'ui' en lugar de 'textflow' si es lo que usas en tu store
  const isLoading = useAppSelector(state => {
    // Si state.ui no tiene savedStatus, debes ajustar esta lógica 
    // o crear ese estado en tu uiSlice
    try {
      return state.ui.savedStatus === 'saving' && action === 'saveDocument';
    } catch (e) {
      // Si state.ui.savedStatus no existe, devolvemos false
      return false;
    }
  }) || propIsLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Si hay un manejador de clic personalizado, ejecútalo primero
    if (onClick) {
      onClick(e);
    }
    
    // Si se proporciona una acción, despáchala
    // Ajustamos para usar 'ui' en lugar de 'textflow' si es lo que usas en tu store
    if (action) {
      dispatch({ type: `ui/${action}`, payload: actionPayload });
    }
  };

  return (
    <ButtonTestFlow
      {...buttonProps}
      isLoading={isLoading}
      onClick={handleClick}
    />
  );
};

export default ButtonContainer;