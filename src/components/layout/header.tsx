"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          ReUse ♻️
        </Link>

        <nav className="hidden md:flex gap-6 font-medium">
          <Link href="/cupons" className="hover:text-green-200">
            Cupons
          </Link>
          <Link href="/itens" className="hover:text-green-200">
            Itens
          </Link>
          <Link href="/pagamentos" className="hover:text-green-200">
            Pagamentos
          </Link>
          <Link href="/usuarios" className="hover:text-green-200">
            Usuários
          </Link>
           <Link href="/historico" className="hover:text-green-200">
            Histórico
          </Link>
           <Link href="/avaliacao" className="hover:text-green-200">
            Avaliação
          </Link>
        </nav>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-green-600">
          <Link href="/cupom" className="block hover:text-green-200">
            Cupons
          </Link>
          <Link href="/itens" className="block hover:text-green-200">
            Itens
          </Link>
          <Link href="/pagamentos" className="block hover:text-green-200">
            Pagamentos
          </Link>
          <Link href="/usuarios" className="block hover:text-green-200">
            Usuários
          </Link>
        </div>
      )}
    </header>
  );
}
