// src/redux/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define las interfaces para el estado de UI
interface SocialMediaLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface NavigationLink {
  id: string;
  name: string;
  url: string;
}

interface AppInfo {
  companyName: string;
  description: string;
  copyright: string;
}

interface Navigation {
  quickLinks: NavigationLink[];
  legalLinks: NavigationLink[];
}

interface UIState {
  savedStatus: string;
  appInfo: AppInfo;
  navigation: Navigation;
  socialMedia: SocialMediaLink[];
  theme: 'light' | 'dark';
  isMenuOpen: boolean;
}

// Función para obtener el tema del localStorage
const getInitialTheme = (): 'light' | 'dark' => {
  // Si estamos en el navegador, intentamos obtener el tema del localStorage
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    // Si existe un tema guardado, lo usamos
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Si no hay tema guardado, podemos intentar detectar la preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // Por defecto, usamos el tema claro
  return 'light';
};

// Estado inicial para UI
const initialState: UIState = {
    appInfo: {
        companyName: 'Test Flow',
        description: 'Transformando la educación con tecnología avanzada e inteligencia artificial.',
        copyright: 'Todos los derechos reservados.'
    },
    navigation: {
        quickLinks: [
            { id: '1', name: 'Inicio', url: '/' },
            { id: '2', name: 'Características', url: '/features' },
            { id: '3', name: 'Planes', url: '/pricing' },
            { id: '4', name: 'Contacto', url: '/contact' }
        ],
        legalLinks: [
            { id: '1', name: 'Términos de servicio', url: '/terms' },
            { id: '2', name: 'Política de privacidad', url: '/privacy' },
            { id: '3', name: 'Cookies', url: '/cookies' }
        ]
    },
    socialMedia: [
        {
            id: '1',
            name: 'Facebook',
            url: 'https://facebook.com/testflow',
            icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>'
        },
        {
            id: '2',
            name: 'Twitter',
            url: 'https://twitter.com/testflow',
            icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/></svg>'
        },
        {
            id: '3',
            name: 'Instagram',
            url: 'https://instagram.com/testflow',
            icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
        }
    ],
    theme: getInitialTheme(), // Utilizamos la función para obtener el tema inicial
    isMenuOpen: false,
    savedStatus: ''
};

// Crear el slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      
      // Guardar el tema en localStorage cuando cambia
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        
        // También podemos aplicar clases al elemento HTML/body para estilos globales
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      
      // Guardar el tema en localStorage cuando se establece explícitamente
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        
        // También podemos aplicar clases al elemento HTML/body para estilos globales
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }
      }
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setMenuState: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    updateAppInfo: (state, action: PayloadAction<Partial<AppInfo>>) => {
      state.appInfo = { ...state.appInfo, ...action.payload };
    },
    addQuickLink: (state, action: PayloadAction<NavigationLink>) => {
      state.navigation.quickLinks.push(action.payload);
    },
    removeQuickLink: (state, action: PayloadAction<string>) => {
      state.navigation.quickLinks = state.navigation.quickLinks.filter(
        link => link.id !== action.payload
      );
    },
    addLegalLink: (state, action: PayloadAction<NavigationLink>) => {
      state.navigation.legalLinks.push(action.payload);
    },
    removeLegalLink: (state, action: PayloadAction<string>) => {
      state.navigation.legalLinks = state.navigation.legalLinks.filter(
        link => link.id !== action.payload
      );
    },
    addSocialMedia: (state, action: PayloadAction<SocialMediaLink>) => {
      state.socialMedia.push(action.payload);
    },
    removeSocialMedia: (state, action: PayloadAction<string>) => {
      state.socialMedia = state.socialMedia.filter(
        link => link.id !== action.payload
      );
    }
  }
});

// Exportar acciones
export const {
  toggleTheme,
  setTheme,
  toggleMenu,
  setMenuState,
  updateAppInfo,
  addQuickLink,
  removeQuickLink,
  addLegalLink,
  removeLegalLink,
  addSocialMedia,
  removeSocialMedia
} = uiSlice.actions;

// Exportar el reducer
export default uiSlice.reducer;

// Selector para obtener el tema actual
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;

// Selector para obtener el estado del menú
export const selectMenuState = (state: { ui: UIState }) => state.ui.isMenuOpen;

// Selector para obtener la información de la aplicación
export const selectAppInfo = (state: { ui: UIState }) => state.ui.appInfo;

// Selector para obtener los enlaces de navegación
export const selectNavigation = (state: { ui: UIState }) => state.ui.navigation;

// Selector para obtener los enlaces de redes sociales
export const selectSocialMedia = (state: { ui: UIState }) => state.ui.socialMedia;