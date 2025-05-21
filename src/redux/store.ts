import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import uiReducer from './slice/uiSlice';  // Asegúrate de que esta ruta de importación sea correcta
import { useDispatch, useSelector } from 'react-redux';

// Definimos el reducer principal combinando todos los reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,  // Usamos 'ui' como clave para que coincida con tus componentes
  // Puedes agregar más reducers aquí cuando los crees
});

// Configuración del store principal
export const store = configureStore({
  reducer: rootReducer,
  // Herramientas de desarrollo solo habilitadas en entornos que no sean de producción
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoramos acciones específicas que pueden contener datos no serializables
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Función para crear un store de pruebas con estado inicial personalizable
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Exportamos los tipos para usar en toda la aplicación
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Creamos un hook para acceder al estado tipado del store
export const useAppSelector = useSelector<RootState>;
// Creamos un hook para despachar acciones tipadas
export const useAppDispatch = () => useDispatch<AppDispatch>();