'use client';

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from "@heroui/react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toggleTheme, toggleMenu, setMenuState } from "@/redux/slice/uiSlice";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const dispatch = useAppDispatch();
  
  // Obtenemos los estados desde Redux en lugar de useState local
  const isMenuOpen = useAppSelector((state) => state.ui.isMenuOpen);
  const theme = useAppSelector((state) => state.ui.theme);
  const navigation = useAppSelector((state) => state.ui.navigation);
  
  // Función para manejar la apertura/cierre del menú usando Redux
  const handleMenuOpenChange = (isOpen: boolean) => {
    dispatch(setMenuState(isOpen));
  };
  
  // Estructura de datos para los elementos del menú con sus subopciones
  const menuItems = [
    {
      name: "Home",
      subItems: ["Inicio", "Destacados", "Novedades"]
    },
    {
      name: "Productos",
      subItems: ["Catálogo", "Ofertas", "Más Vendidos", "Nuevos Lanzamientos"]
    },
    {
      name: "Servicios",
      subItems: ["Consultoría", "Soporte", "Implementación", "Capacitación"]
    },
    {
      name: "Nosotros",
      subItems: ["Quienes Somos", "Equipo", "Historia"]
    },
    {
      name: "Blog",
      subItems: ["Artículos", "Tutoriales", "Casos de Éxito", "Entrevistas"]
    },
  ];

  // Función para generar URL limpia
  const getCleanUrl = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };
  
  // Función para cambiar el tema
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Aplicamos clases condicionales según el tema de Redux
  const themeClasses = theme === 'dark' 
    ? 'dark text-white bg-gray-900' 
    : 'light text-gray-900 bg-white';

  return (
    <Navbar 
      onMenuOpenChange={handleMenuOpenChange}
      className={themeClasses}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Base del libro */}
            <path d="M8 10C8 8.89543 8.89543 8 10 8H30C31.1046 8 32 8.89543 32 10V30C32 31.1046 31.1046 32 30 32H10C8.89543 32 8 31.1046 8 30V10Z" fill="currentColor" fillOpacity="0.2"/>
            
            {/* Páginas del libro */}
            <path d="M12 12H28V28H12V12Z" fill={theme === 'dark' ? '#333' : 'white'}/>
            
            {/* Líneas de texto */}
            <path d="M14 16H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 20H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 24H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            
            {/* Lápiz/Pluma */}
            <path d="M26 22L30 18L32 20L28 24L26 22Z" fill="currentColor"/>
            <path d="M25 23L24 26L27 25L25 23Z" fill="currentColor"/>
          </svg>
          <p className="font-bold text-inherit ml-2">
            {useAppSelector(state => state.ui.appInfo.companyName).substring(0, 2)}
          </p>
        </NavbarBrand>
      </NavbarContent>

      {/* Menú para pantallas medianas y grandes */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => {
          // Solo mostrar los primeros 6 elementos en la barra principal
          if (index < 6) {
            return (
              <NavbarItem key={index}>
                <div className="relative group">
                  <Button 
                    variant="light" 
                    className={`p-0 bg-transparent ${theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}
                  >
                    {item.name}
                  </Button>
                  <div className={`absolute left-0 hidden group-hover:block hover:block z-50 min-w-[200px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-md mt-1`}>
                    <div className="py-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <div key={subIndex} className={`px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          <Link href={`/${getCleanUrl(item.name)}/${getCleanUrl(subItem)}`}>
                            {subItem}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </NavbarItem>
            );
          }
          return null;
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Botón de tema */}
        <NavbarItem className="mr-2">
          <Button 
            variant="flat" 
            isIconOnly
            onClick={handleThemeToggle}
            className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" variant="flat">
            <Link href="/contacto">Contacto</Link>
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Menú móvil */}
      <NavbarMenu className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
        {menuItems.map((item, index) => (
          <div key={`${item.name}-${index}`}>
            <div className="relative group">
              <Button 
                variant="light" 
                className={`w-full justify-start p-2 mb-2 ${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                {item.name}
              </Button>
              <div className={`hidden group-hover:block hover:block w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-md mb-2`}>
                {item.subItems.map((subItem, subIndex) => (
                  <div key={subIndex} className={`px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Link 
                      className="w-full block" 
                      href={`/${getCleanUrl(item.name)}/${getCleanUrl(subItem)}`}
                    >
                      {subItem}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}