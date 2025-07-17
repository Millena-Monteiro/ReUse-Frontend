// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '../app/providers/Providers'; // <-- CORRIGIDO AQUI
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'ReUse',
  description: 'Moda Sustentável e Conexões',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-white to-purple-100 text-purple-900 font-sans antialiased overflow-x-hidden flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}