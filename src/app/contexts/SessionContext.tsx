"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface SessionContextType {
  user: any; // ⚠️ Considere tipar 'user' de forma mais específica no futuro
  login: (userData: any) => void; // ⚠️ Considere tipar 'userData' de forma mais específica no futuro
  logout: () => void;
  isAuthenticated: boolean;
  // isLoading: boolean; // 🗑️ Removido se não for usado
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null); // ⚠️ Considere tipar 'user' de forma mais específica
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true); // 🗑️ Removido se não for usado

  const login = (userData: any) => {
    // ⚠️ Considere tipar 'userData' de forma mais específica
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SessionContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
