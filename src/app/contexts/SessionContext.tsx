"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

// 💡 Exemplo de interface para um contexto de sessão customizado
interface CustomSessionContextType {
  someCustomData: string;
  setSomeCustomData: (data: string) => void;
  // Pode adicionar aqui quaisquer outros dados ou funções que queira compartilhar
}

// Cria o contexto com um valor padrão
const SessionContext = createContext<CustomSessionContextType | undefined>(
  undefined
);

interface SessionProviderProps {
  children: ReactNode;
}

// Componente Provedor para o contexto
export const SessionContextProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [someCustomData, setSomeCustomData] = useState("Dados Iniciais");

  const value = {
    someCustomData,
    setSomeCustomData,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      "useSessionContext must be used within a SessionContextProvider"
    );
  }
  return context;
};

// Se este arquivo foi criado para envolver o NextAuth.js,
// a abordagem preferencial é usar src/app/providers/session-provider.tsx
// e importar useSession diretamente de 'next-auth/react'.
// Este arquivo é para *outros* dados de sessão que não sejam de autenticação.
