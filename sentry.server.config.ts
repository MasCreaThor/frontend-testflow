import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  beforeSend(event, hint) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Server Event:', event);
    }

    event.tags = {
      ...event.tags,
      server: true,
      nodeVersion: process.version,
    };

    // ❌ Eliminado getContext inválido
    // Si quieres añadir información de la request, deberías usar setContext en middleware o en una API route

    return event;
  },

  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'http') {
      breadcrumb.level = 'info';
    }

    if (breadcrumb.category === 'query') {
      breadcrumb.level = 'info';
    }

    return breadcrumb;
  },

  ignoreErrors: [
    'ECONNRESET',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ETIMEDOUT',
  ],
});
