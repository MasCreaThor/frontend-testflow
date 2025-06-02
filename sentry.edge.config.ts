// sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set sample rates
  tracesSampleRate: 1.0,
  
  // Configuración del entorno
  environment: process.env.NODE_ENV,
  
  // Configuración de debugging
  debug: process.env.NODE_ENV === 'development',
  
  // Configuración de release
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Edge runtime específico
  beforeSend(event, hint) {
    // En desarrollo, log el evento
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Edge Event:', event);
    }
    
    // Agregar información del edge runtime
    event.tags = {
      ...event.tags,
      runtime: 'edge',
    };
    
    return event;
  },
});