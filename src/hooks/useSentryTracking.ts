// src/hooks/useSentryTracking.ts
'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { useAuth } from '@/contexts/AuthContext';

interface TrackingOptions {
  enablePageViews?: boolean;
  enableUserTracking?: boolean;
  enableFormTracking?: boolean;
  enableClickTracking?: boolean;
}

export const useSentryTracking = (options: TrackingOptions = {}) => {
  const {
    enablePageViews = true,
    enableUserTracking = true,
    enableFormTracking = true,
    enableClickTracking = true,
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoggedIn } = useAuth();

  // Track page views
  useEffect(() => {
    if (enablePageViews) {
      const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
      
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: `User navigated to ${url}`,
        level: 'info',
        data: {
          path: pathname,
          search: searchParams?.toString(),
          timestamp: new Date().toISOString(),
        },
      });

      // Set page context
      Sentry.setContext('page', {
        path: pathname,
        search: searchParams?.toString(),
        url,
      });

      // Track as custom span instead of transaction
      Sentry.startSpan({
        name: `Page View: ${pathname}`,
        op: 'navigation',
        attributes: {
          path: pathname,
          search: searchParams?.toString(),
        },
      }, (span) => {
        // Span se completa automáticamente
        setTimeout(() => {
          span.end();
        }, 100);
      });
    }
  }, [pathname, searchParams, enablePageViews]);

  // Track user information
  useEffect(() => {
    if (enableUserTracking) {
      Sentry.setUser({
        id: user?._id || 'anonymous',
        email: user?.email,
        authenticated: isLoggedIn,
      });

      Sentry.setContext('auth', {
        isLoggedIn,
        hasUser: !!user,
        userId: user?._id,
      });

      if (isLoggedIn && user) {
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'User authenticated',
          level: 'info',
          data: {
            userId: user._id,
            email: user.email,
          },
        });
      }
    }
  }, [user, isLoggedIn, enableUserTracking]);

  // Function to track custom events
  const trackEvent = useCallback((
    eventName: string,
    data?: Record<string, any>,
    level: 'info' | 'warning' | 'error' = 'info'
  ) => {
    Sentry.addBreadcrumb({
      category: 'custom',
      message: eventName,
      level,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        page: pathname,
      },
    });
  }, [pathname]);

  // Function to track form interactions
  const trackFormEvent = useCallback((
    action: 'start' | 'submit' | 'error' | 'success',
    formName: string,
    data?: Record<string, any>
  ) => {
    if (!enableFormTracking) return;

    Sentry.addBreadcrumb({
      category: 'form',
      message: `Form ${action}: ${formName}`,
      level: action === 'error' ? 'error' : 'info',
      data: {
        formName,
        action,
        ...data,
        timestamp: new Date().toISOString(),
        page: pathname,
      },
    });
  }, [enableFormTracking, pathname]);

  // Function to track button clicks
  const trackClick = useCallback((
    element: string,
    data?: Record<string, any>
  ) => {
    if (!enableClickTracking) return;

    Sentry.addBreadcrumb({
      category: 'ui.click',
      message: `User clicked: ${element}`,
      level: 'info',
      data: {
        element,
        ...data,
        timestamp: new Date().toISOString(),
        page: pathname,
      },
    });
  }, [enableClickTracking, pathname]);

  // Function to track API calls
  const trackApiCall = useCallback((
    method: string,
    url: string,
    status?: number,
    duration?: number,
    error?: string
  ) => {
    const level = error ? 'error' : status && status >= 400 ? 'warning' : 'info';
    
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${method} ${url}`,
      level,
      data: {
        method,
        url,
        status,
        duration,
        error,
        timestamp: new Date().toISOString(),
        page: pathname,
      },
    });
  }, [pathname]);

  // Function to set custom context
  const setContext = useCallback((key: string, context: Record<string, any>) => {
    Sentry.setContext(key, context);
  }, []);

  // Function to track performance
  const trackPerformance = useCallback((name: string, startTime: number) => {
    const duration = Date.now() - startTime;
    
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Performance: ${name}`,
      level: 'info',
      data: {
        name,
        duration,
        timestamp: new Date().toISOString(),
        page: pathname,
      },
    });

    // Also track as a custom metric
    Sentry.setMeasurement(name, duration, 'millisecond');
  }, [pathname]);

  // Function to track feature usage
  const trackFeatureUsage = useCallback((feature: string, data?: Record<string, any>) => {
    Sentry.addBreadcrumb({
      category: 'feature',
      message: `Feature used: ${feature}`,
      level: 'info',
      data: {
        feature,
        ...data,
        timestamp: new Date().toISOString(),
        page: pathname,
        user: user?._id || 'anonymous',
      },
    });

    // Set tag for feature usage
    Sentry.setTag(`feature.${feature}`, true);
  }, [pathname, user]);

  return {
    trackEvent,
    trackFormEvent,
    trackClick,
    trackApiCall,
    trackPerformance,
    trackFeatureUsage,
    setContext,
  };
};

// Hook específico para tracking de formularios
export const useFormTracking = (formName: string) => {
  const { trackFormEvent } = useSentryTracking();

  const trackFormStart = useCallback(() => {
    trackFormEvent('start', formName);
  }, [trackFormEvent, formName]);

  const trackFormSubmit = useCallback((data?: Record<string, any>) => {
    trackFormEvent('submit', formName, data);
  }, [trackFormEvent, formName]);

  const trackFormError = useCallback((error: string, field?: string) => {
    trackFormEvent('error', formName, { error, field });
  }, [trackFormEvent, formName]);

  const trackFormSuccess = useCallback((data?: Record<string, any>) => {
    trackFormEvent('success', formName, data);
  }, [trackFormEvent, formName]);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFormSuccess,
  };
};