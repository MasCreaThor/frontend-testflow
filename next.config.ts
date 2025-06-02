// next.config.ts
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desactivar la comprobación de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  
  // Configuración experimental para instrumentación
  experimental: {
    instrumentationHook: true,
  },
  
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// Configuración de Sentry
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  
  // Organization and project for Sentry
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // Authentication token for Sentry
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Release name
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Source maps configuration
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  
  // Upload source maps in production only
  include: process.env.NODE_ENV === 'production' ? './src' : undefined,
  ignore: ['node_modules', 'webpack.config.js'],
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);