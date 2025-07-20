"use client";

import React, { ReactNode } from "react";
import SessionProviderWrapper from "./session-provider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * @component Providers
 * @description Componente agregador que aninha todos os provedores da aplicação.
 * Adicione outros provedores (ex: ThemeProvider, ReduxProvider) aqui conforme necessário.
 * @param {ReactNode} children - Os componentes filhos que terão acesso a todos os contextos dos provedores.
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // 💡 DEBUG: Adicione este console.log temporariamente para verificar o que SessionProviderWrapper é.
  //console.log("SessionProviderWrapper no Providers.tsx:",SessionProviderWrapper);

  // Aninhe todos os provedores aqui.
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
};

export default Providers;
