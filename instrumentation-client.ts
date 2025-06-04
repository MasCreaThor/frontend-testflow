// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sampleo de sesiones
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',

  integrations: [
    new Replay({
      maskAllText: true,
      blockAllMedia: false,
      unmask: ['.sentry-unmask'],
    }),
  ],

  beforeBreadcrumb(breadcrumb, hint) {
    // Filtrar breadcrumbs innecesarios
    if (breadcrumb.category === 'console' && breadcrumb.level !== 'error') {
      return null;
    }

    if (breadcrumb.category === 'navigation') {
      breadcrumb.level = 'info';
    }

    if (breadcrumb.category === 'ui.click') {
      breadcrumb.level = 'info';
    }

    return breadcrumb;
  },

  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event:', event);
    }

    // Verificar si el usuario está autenticado
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    
    if (isAuthenticated) {
      event.user = {
        ...event.user,
        authenticated: true,
      };
    }

    // Agregar contexto del navegador
    if (typeof window !== 'undefined') {
      event.tags = {
        ...event.tags,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      event.contexts = {
        ...event.contexts,
        browser: {
          name: navigator.userAgent,
          version: navigator.appVersion,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
    }

    return event;
  },

  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  ignoreErrors: [
    'Network request failed',
    'Failed to fetch',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'Script error.',
    'ChunkLoadError',
    'Loading chunk',
    'Loading CSS chunk',
  ],

  beforeSendTransaction(event) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Transaction:', event);
    }
    return event;
  },
});