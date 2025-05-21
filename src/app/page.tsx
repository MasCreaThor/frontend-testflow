'use client';

import { redirect } from 'next/navigation';
 



export default function Home() {
 
  redirect('/home/inicio');
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Hola, Bienvenido a TestFlow</h1>
      <p className="text-lg text-gray-700 mb-8">Tu compañero de estudio inteligente.</p>
    </div>
  );
}