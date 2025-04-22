 // src/app/page.tsx
 'use client';
 import { redirect } from 'next/navigation';
 import Navbar from '@/components/components_base/Navbar';
 import Header from '@/components/components_base/Header/Header';
 import Footer from '@/components/components_base/Footer/Footer';
 import Modal from '@/components/components_base/Modal/Modal';
 import Sidebar from '@/components/components_base/Sidebar';
 import { useEffect, useState } from 'react';
 import ProductShowcase from '@/components/components_base/ProductShowcase';
 
 export default function Home() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   useEffect(() => {
     setIsModalOpen(true);
   }, []);
 
   return (
     <div>
       
       <Header/>
       
 
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
     
       <div className=''>
       <Footer />
       </div>
       
      
     </div>
   );
   return null;
 }