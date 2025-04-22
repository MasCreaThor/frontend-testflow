'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
 

export default function Home() {
   
    redirect('/home/inicio')
  // No renderizamos nada, ya que la redirección ocurrirá inmediatamente
  return null;
}