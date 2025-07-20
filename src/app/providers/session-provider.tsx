// src/app/providers/session-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}

/**
 * @component SessionProviderWrapper
 * @description Componente wrapper para o SessionProvider do NextAuth.js.
 * É um Client Component necessário para que o contexto da sessão esteja disponível no lado do cliente.
 * @param {ReactNode} children - Os componentes filhos que terão acesso ao contexto da sessão.
 */
const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
