import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay"; // 👈 esta es la integración correcta

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
    }), // 👈 integración correcta
  ],

  beforeBreadcrumb(breadcrumb, hint) {
    // ... tu lógica está bien aquí
    return breadcrumb;
  },

  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event:', event);
    }

    const user = localStorage.getItem('accessToken');
    if (user) {
      event.user = {
        ...event.user,
        authenticated: true,
      };
    }

    event.tags = {
      ...event.tags,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    return event;
  },

  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  ignoreErrors: [
    'Network request failed',
    'Failed to fetch',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'Script error.',
  ],

  beforeSendTransaction(event) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Transaction:', event);
    }
    return event;
  },
});
