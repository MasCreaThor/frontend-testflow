// src/app/page.tsx
'use client';
import { redirect } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Modal from '@/components/home/Modal';
import Sidebar from '@/components/home/Sidebar';
import { useEffect, useState } from 'react';
import ProductShowcase from '@/components/home/ProductShowcase';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div>
      
      <Header/>
      
      <Sidebar />
      <Navbar />
      <ProductShowcase />
      <div className="flex flex-col items-center justify-center min-h-screen  bg-gray-100">

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">Hola, Bienvenido a TestFlow</h1>
          <p className="text-lg text-gray-700 mb-8">Tu compañero de estudio inteligente.</p>
          <button
            onClick={() => redirect('/about')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Comenzar
          </button>
        </div>
      </div>
    
   
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to TestFlow"
        size="md"
      >
        <p className="text-gray-700">
          TestFlow te ayuda a estudiar mejor mediante preguntas inteligentes generadas automáticamente desde tus PDFs y material de estudio.
        </p>
        <div className="mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Cerrar
          </button>
        </div>
      </Modal>
      <div className=''>
      <Footer />
      </div>
      
     
    </div>
  );
  return null;
}