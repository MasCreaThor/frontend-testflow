'use client';

import React, { ReactNode, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface SimpleSentryProviderProps {
  children: ReactNode;
}

/**
 * Proveedor simplificado de Sentry que no usa hooks problemáticos durante SSG
 */
const SimpleSentryProvider: React.FC<SimpleSentryProviderProps> = ({ children }) => {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Track cuando la aplicación se carga por primera vez
    Sentry.addBreadcrumb({
      category: 'app',
      message: 'App loaded',
      level: 'info',
      data: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    });

    // Tracking automático de clicks en elementos importantes
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Solo trackear clicks en botones, enlaces y elementos con data-track
      const shouldTrack = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.hasAttribute('data-track') ||
        target.closest('button') ||
        target.closest('a');

      if (shouldTrack) {
        const element = target.closest('button, a, [data-track]') || target;
        const elementText = element.textContent?.slice(0, 50) || '';
        const elementId = element.id || '';
        const elementClass = element.className || '';
        const trackName = element.getAttribute('data-track') || elementText || 'Unknown Element';

        Sentry.addBreadcrumb({
          category: 'ui.click',
          message: `User clicked: ${trackName}`,
          level: 'info',
          data: {
            element: trackName,
            tagName: element.tagName.toLowerCase(),
            text: elementText,
            id: elementId,
            className: elementClass,
            href: element.getAttribute('href'),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
          },
        });
      }
    };

    // Tracking automático de errores no capturados
    const handleUnhandledError = (event: ErrorEvent) => {
      Sentry.addBreadcrumb({
        category: 'error',
        message: 'Unhandled JavaScript error',
        level: 'error',
        data: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    // Tracking de promises rechazadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      Sentry.addBreadcrumb({
        category: 'error',
        message: 'Unhandled promise rejection',
        level: 'error',
        data: {
          reason: String(event.reason),
        },
      });
    };

    // Tracking de cambios de visibilidad de la página
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      Sentry.addBreadcrumb({
        category: 'app',
        message: isVisible ? 'Page focused' : 'Page blurred',
        level: 'info',
        data: {
          visibility: isVisible ? 'visible' : 'hidden',
          timestamp: new Date().toISOString(),
        },
      });
    };

    // Intercept fetch calls for API tracking
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : resource instanceof URL ? resource.href : resource.url;
      const method = config?.method || 'GET';
      const startTime = Date.now();

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        Sentry.addBreadcrumb({
          category: 'http',
          message: `${method} ${url}`,
          level: response.ok ? 'info' : 'warning',
          data: {
            method,
            url,
            status: response.status,
            duration,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
          },
        });
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        Sentry.addBreadcrumb({
          category: 'http',
          message: `${method} ${url}`,
          level: 'error',
          data: {
            method,
            url,
            status: 0,
            duration,
            error: String(error),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
          },
        });
        
        throw error;
      }
    };

    // Agregar event listeners
    document.addEventListener('click', handleClick, true);
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
};

export default SimpleSentryProvider;