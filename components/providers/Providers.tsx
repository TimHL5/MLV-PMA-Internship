'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            border: '1px solid rgba(106, 198, 112, 0.2)',
            color: '#f8f8f2',
          },
        }}
      />
    </AuthProvider>
  );
}
