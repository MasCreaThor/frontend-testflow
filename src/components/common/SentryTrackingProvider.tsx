// src/components/common/SentryTrackingProvider.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSentryTracking } from '@/hooks/useSentryTracking';
import * as Sentry from '@sentry/nextjs';

// Interfaz para PerformanceEventTiming que incluye processingStart
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart?: number;
}

// Interfaz para Layout Shift entries
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface SentryTrackingProviderProps {
  children: ReactNode;
}

/**
 * Proveedor que inicializa el tracking automático de Sentry
 */
const SentryTrackingProvider: React.FC<SentryTrackingProviderProps> = ({ children }) => {
  const { trackEvent, trackClick, trackApiCall } = useSentryTracking();

  useEffect(() => {
    // Track cuando la aplicación se carga por primera vez
    trackEvent('App Loaded', {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer,
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

        trackClick(trackName, {
          tagName: element.tagName.toLowerCase(),
          text: elementText,
          id: elementId,
          className: elementClass,
          href: element.getAttribute('href'),
        });
      }
    };

    // Tracking automático de cambios de formulario
    const handleFormChange = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!target) return;

      const form = target.closest('form');
      const formName = form?.getAttribute('name') || form?.id || 'Unknown Form';
      const fieldName = target.name || target.id || 'Unknown Field';

      Sentry.addBreadcrumb({
        category: 'ui.input',
        message: `User modified field: ${fieldName} in form: ${formName}`,
        level: 'info',
        data: {
          formName,
          fieldName,
          fieldType: target.type,
          value: target.type === 'password' ? '[HIDDEN]' : target.value?.slice(0, 100),
        },
      });
    };

    // Tracking automático de errores de formulario
    const handleFormInvalid = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target) return;

      const form = target.closest('form');
      const formName = form?.getAttribute('name') || form?.id || 'Unknown Form';

      Sentry.addBreadcrumb({
        category: 'form.validation',
        message: `Form validation error in ${formName}`,
        level: 'warning',
        data: {
          formName,
          fieldName: target.name || target.id,
          validationMessage: target.validationMessage,
        },
      });
    };

    // Tracking de errores no capturados
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
      trackEvent(isVisible ? 'Page Focused' : 'Page Blurred', {
        visibility: isVisible ? 'visible' : 'hidden',
      });
    };

    // Tracking de tiempo en la página (cuando se va)
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - performance.timeOrigin;
      trackEvent('Page Unload', {
        sessionDuration,
        sessionDurationMinutes: Math.round(sessionDuration / 60000),
      });
    };

    // Agregar event listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('change', handleFormChange, true);
    document.addEventListener('invalid', handleFormInvalid, true);
    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

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
        
        trackApiCall(method, url, response.status, duration);
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        trackApiCall(method, url, 0, duration, String(error));
        throw error;
      }
    };

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('change', handleFormChange, true);
      document.removeEventListener('invalid', handleFormInvalid, true);
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, [trackEvent, trackClick, trackApiCall]);

  // Track performance metrics
  useEffect(() => {
    // Track Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          Sentry.setMeasurement('lcp', lastEntry.startTime, 'millisecond');
          Sentry.addBreadcrumb({
            category: 'performance',
            message: 'Largest Contentful Paint measured',
            level: 'info',
            data: {
              value: lastEntry.startTime,
              metric: 'lcp',
            },
          });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Type assertion para PerformanceEventTiming
            const eventEntry = entry as PerformanceEventTiming;
            if (eventEntry.processingStart) {
              const fid = eventEntry.processingStart - eventEntry.startTime;
              Sentry.setMeasurement('fid', fid, 'millisecond');
              Sentry.addBreadcrumb({
                category: 'performance',
                message: 'First Input Delay measured',
                level: 'info',
                data: {
                  value: fid,
                  metric: 'fid',
                },
              });
            }
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Type assertion para LayoutShiftEntry
            const layoutEntry = entry as LayoutShiftEntry;
            if (!layoutEntry.hadRecentInput) {
              clsValue += layoutEntry.value;
            }
          });
          
          Sentry.setMeasurement('cls', clsValue, 'metric');
          Sentry.addBreadcrumb({
            category: 'performance',
            message: 'Cumulative Layout Shift measured',
            level: 'info',
            data: {
              value: clsValue,
              metric: 'cls',
            },
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }, []);

  return <>{children}</>;
};

export default SentryTrackingProvider;