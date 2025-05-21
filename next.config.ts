/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desactivar la comprobación de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  // Resto de tu configuración...
};

module.exports = nextConfig;