import "@/styles/globals.css"; // Esto carga Tailwind y los estilos globales

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}





