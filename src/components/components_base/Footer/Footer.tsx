// components/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';
import '@/styles/footer.css';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { UrlObject } from 'url';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  
  // Ahora usamos los selectores del slice de UI
  const appInfo = useAppSelector(state => state.ui.appInfo);
  const { quickLinks, legalLinks } = useAppSelector(state => state.ui.navigation);
  const socialLinks = useAppSelector(state => state.ui.socialMedia);
  const theme = useAppSelector(state => state.ui.theme);
  
  // Podemos usar este método para registrar clics
  const handleLinkClick = (linkName: string) => {
    // Esto podría despachar una acción de seguimiento si lo necesitas
    console.log(`Link clicked: ${linkName}`);
  };
  
  const currentYear = new Date().getFullYear();
  
  // Aplicamos clases condicionales basadas en el tema
  const footerBgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800';
  
  return (
    <footer className={`${footerBgClass} text-white py-12 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <span className="text-3xl font-bold">
                <span className="bg-indigo-600 text-white px-2 py-1 rounded mr-1">Test</span>
                <span className="text-white">Flow</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              {appInfo.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link: { id: React.Key | null | undefined; url: string | UrlObject; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                <li key={link.id}>
                  <Link 
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => typeof link.name === 'string' && handleLinkClick(link.name)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link: { id: React.Key | null | undefined; url: string | UrlObject; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                <li key={link.id}>
                  <Link 
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => typeof link.name === 'string' && handleLinkClick(link.name)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social: { id: React.Key | null | undefined; url: string | undefined; name: string; icon: any; }) => (
                <a 
                  key={social.id}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleLinkClick(social.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visita nuestro perfil de ${social.name}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: social.icon }} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {appInfo.companyName}. {appInfo.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;