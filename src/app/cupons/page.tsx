"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Cupom {
  id: string;
  codigo: string;
  valor: number;
  validade: string;
  utilizado: boolean;
  userId?: string;
}

export default function CuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  const fetchCupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.data.get<Cupom[]>("/cupons");
      setCupons(response.data);
    } catch (err: any) {
      setError(
        "Ocorreu um erro ao carregar os cupons. Por favor, tente novamente."
      );
      console.error("Erro ao buscar cupons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCupons();
  }, [fetchCupons]);

  const handleRefresh = () => {
    fetchCupons();
  };

  // 💡 FUNÇÃO handleCopy ATUALIZADA PARA USAR navigator.clipboard.writeText()
  const handleCopy = async (couponCode: string, couponId: string) => {
    try {
      // Verifica se a Clipboard API está disponível no navegador
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(couponCode); // Copia o texto
        setCopiedCouponId(couponId); // Define o ID do cupom copiado para mostrar o feedback
        setTimeout(() => setCopiedCouponId(null), 2000); // Remove o feedback após 2 segundos
      } else {
        // Fallback para navegadores mais antigos ou contextos restritos
        const el = document.createElement("textarea");
        el.value = couponCode;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopiedCouponId(couponId);
        setTimeout(() => setCopiedCouponId(null), 2000);
        console.warn("Usando fallback document.execCommand para copiar.");
      }
    } catch (err) {
      console.error("Falha ao copiar o cupom: ", err);
      alert(
        "Erro ao copiar o cupom. Por favor, copie manualmente: " + couponCode
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">
          Carregando cupons...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Isso pode levar alguns segundos, especialmente se o servidor estiver
          "dormindo".
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto max-w-md text-center border border-red-200">
          <p className="text-2xl text-red-700 font-bold mb-4">
            Ops! Algo deu errado.
          </p>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Atualizar Página
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Cupons Disponíveis
      </h1>

      {cupons.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg mx-auto">
          <p className="text-lg text-gray-600 mb-4">
            Nenhum cupom disponível no momento.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Volte mais tarde ou clique em "Atualizar Página" para tentar
            novamente.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Atualizar Página
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cupons.map((cupom) => (
            <div
              key={cupom.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-200 relative"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {cupom.codigo}
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Desconto:{" "}
                <span className="font-semibold text-green-600">
                  {cupom.valor}%
                </span>
              </p>
              <p className="text-md text-gray-600 mb-2">
                Cupom válido para diversas categorias.
              </p>
              <p className="text-sm text-gray-500">
                Válido até:{" "}
                {new Date(cupom.validade).toLocaleDateString("pt-BR")}
              </p>
              <button
                onClick={() => handleCopy(cupom.codigo, cupom.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 mt-4 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                {copiedCouponId === cupom.id ? "Copiado!" : "Copiar Cupom"}
              </button>
              {copiedCouponId === cupom.id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-fade-in-out">
                  Copiado!
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
