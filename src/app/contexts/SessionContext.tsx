// src/contexts/SessionContext.tsx
'use client'; 
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

 
  return (
    <SessionContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}