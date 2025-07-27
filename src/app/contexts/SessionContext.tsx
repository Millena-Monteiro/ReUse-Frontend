"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";

// 👤 Interface para o tipo de usuário que será armazenado na sessão
interface UserSession {
  id: number | string;
  nome: string;
  email: string;
  tipo_user: string;
}

// 💡 Interface para o contexto da sessão
interface SessionContextType {
  user: UserSession | null; // O usuário logado, ou null se não houver
  setUser: (user: UserSession | null) => void; // Função para definir o usuário
  loadingSession: boolean; // Para indicar se a sessão está sendo carregada/validada
}

// Cria o contexto com um valor padrão (null para user, false para loading)
const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

// Componente Provedor para o contexto
export const SessionContextProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true); // Começa como true para indicar que está verificando a sessão

  // 💡 Efeito para tentar carregar a sessão do usuário ao montar o provedor
  // Isso é importante para manter o usuário logado após um recarregamento de página
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoadingSession(true);
        const response = await api.auth.get('/auth/session');
        if (response.status === 200 && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // Token inválido ou expirado, limpar sessão
          setUser(null);
          console.log("Sessão expirada ou inválida. Usuário deslogado.");
        } else {
          console.error("Erro ao carregar sessão:", err);
        }
      } finally {
        setLoadingSession(false); // Finaliza o carregamento
      }
    };

    loadSession();
  }, []); // Executa apenas uma vez ao montar o componente

  const value = {
    user,
    setUser,
    loadingSession,
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
