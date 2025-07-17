// src/app/providers.tsx
'use client'; // Este componente é o wrapper do lado do cliente

import { SessionProvider } from '../contexts/SessionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}