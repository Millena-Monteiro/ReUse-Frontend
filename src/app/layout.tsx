import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReUse",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br to-white text-purple-900 font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
