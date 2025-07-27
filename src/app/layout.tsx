import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
//import Providers from "./providers/Providers";
import { SessionContextProvider } from './contexts/SessionContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReUse",
  description: "Plataforma de doação e troca de itens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />

        <SessionContextProvider>
          {children}
        </SessionContextProvider>

        <Footer />
      </body>
    </html>
  );
}
