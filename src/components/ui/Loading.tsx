'use client';

import React from 'react';
import useLoadingStore from '@/store/loading.store';

interface LoadingProps {
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false }) => {
  const { isLoading, error } = useLoadingStore();

  if (!isLoading && !error) return null;

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'
    : 'relative w-full h-full min-h-[100px] flex items-center justify-center';

  return (
    <div className={containerClasses}>
      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg max-w-md mx-auto">
          <p className="text-red-600 dark:text-red-200 text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Loading;