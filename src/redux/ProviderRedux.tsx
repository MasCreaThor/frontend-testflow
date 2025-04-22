'use client'
import React from 'react'
import { Provider } from 'react-redux';
import { store } from './store';

interface ProviderReduxProps {
  children: React.ReactNode;
}

function ProviderRedux({ children }: ProviderReduxProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default ProviderRedux