"use client";

import React, { useState, useEffect } from "react"; // 🎣 Importa hooks essenciais do React
import api from "@/lib/api"; // 🌐 Importa a sua instância configurada do Axios
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

// --- DEFINIÇÃO DO TIPO CUPOM (AJUSTADO AO BACKEND) ---
type Cupom = {
  id: string;
  codigo: string;
  valor: number;
  validade: string;
  utilizado: boolean;
  userId: string;
};

export default function CupomPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [form, setForm] = useState({ codigo: "", valor: "", validade: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ⏳ Estado de carregamento

  // Pega todos os cupons (GET)
  const fetchCupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.data.get<Cupom[]>("/cupons");
      setCupons(response.data);
    } catch (err: unknown) {
      // Tipado como 'unknown'
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao buscar cupons:",
          err.response?.data || err.message
        );
        setError("Erro ao carregar cupons. Verifique a API de cupons. 😔");
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao buscar cupons:", err.message);
        setError("Ocorreu um erro inesperado ao carregar cupons. 😔");
      } else {
        console.error("Erro não identificado ao buscar cupons.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCupons();
  }, []);

  // Atualiza o form (input controlado)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Criar cupom (POST) ou editar cupom (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    if (!form.codigo || !form.valor || !form.validade) {
      setError("Preencha todos os campos. ⚠️");
      return;
    }

    // 🎯 CORREÇÃO: Formata a data para ISO string antes de enviar
    const formattedValidade = new Date(form.validade).toISOString();

    try {
      if (editId) {
        // Editar cupom
        await api.data.put(`/cupons/${editId}`, {
          // Usando api.data.put
          codigo: form.codigo,
          valor: Number(form.valor),
          validade: formattedValidade, // 🎯 Usando a data formatada
          // 'utilizado' e 'userId' não são enviados na atualização pelo formulário atual
        });
        setEditId(null);
      } else {
        // Criar cupom
        // 💡 NOTA: O userId fixo "1" é para fins de teste. Em um app real, viria do usuário logado.
        await api.data.post("/cupons", {
          // Usando api.data.post
          codigo: form.codigo,
          valor: Number(form.valor),
          validade: formattedValidade, // 🎯 Usando a data formatada
          userId: "1", // ⚠️ Certifique-se de que este userId existe no seu banco de dados!
          utilizado: false, // Define como false na criação
        });
      }
      setForm({ codigo: "", valor: "", validade: "" });
      fetchCupons(); // Recarrega a lista após a operação
    } catch (err: unknown) {
      // Tipado como 'unknown'
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao salvar cupom:",
          err.response?.data || err.message
        );
        // Mensagem de erro mais detalhada do backend
        setError(
          "Erro ao salvar cupom: " +
            (err.response?.data?.message || "Verifique os logs do backend. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao salvar cupom:", err.message);
        setError("Ocorreu um erro inesperado ao salvar cupom. 😔");
      } else {
        console.error("Erro não identificado ao salvar cupom.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  // Preparar form para editar
  const handleEdit = (cupom: Cupom) => {
    setEditId(cupom.id);
    setForm({
      codigo: cupom.codigo,
      valor: cupom.valor.toString(),
      validade: cupom.validade.slice(0, 10),
    });
  };

  // Deletar cupom
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await api.data.delete(`/cupons/${id}`);
      fetchCupons();
    } catch (err: unknown) {
      // Tipado como 'unknown'
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao deletar cupom:",
          err.response?.data || err.message
        );
        setError(
          "Erro ao deletar cupom: " +
            (err.response?.data?.message || "Verifique os logs do backend. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao deletar cupom:", err.message);
        setError("Ocorreu um erro inesperado ao deletar cupom. 😔");
      } else {
        console.error("Erro não identificado ao deletar cupom.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  // 💡 Determina se o formulário deve ser desabilitado
  const isFormDisabled = !!error; // Desabilita se houver qualquer erro de API

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      {/* <Botoes /> */} {/* ❌ COMENTADO: Removido o componente Botoes */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Gerenciar Cupons
      </h1>
      {loading && <p className="text-blue-500 mb-2">Carregando cupons... ⏳</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {isFormDisabled && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Atenção!</strong>
          <span className="block sm:inline">
            {" "}
            A funcionalidade de criar/editar cupons está temporariamente
            indisponível devido a um problema no backend. Por favor, tente
            novamente mais tarde.
          </span>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`mb-6 space-y-2 bg-green-50 p-4 rounded shadow ${
          isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div>
          <label className="block font-semibold text-gray-800" htmlFor="codigo">
            Código
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            value={form.codigo}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-800"
            disabled={isFormDisabled} // Desabilita o input
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-800" htmlFor="valor">
            Valor (R$)
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-800"
            min="0"
            step="0.01"
            disabled={isFormDisabled} // Desabilita o input
          />
        </div>

        <div>
          <label
            className="block font-semibold text-gray-800"
            htmlFor="validade"
          >
            Validade
          </label>
          <input
            id="validade"
            name="validade"
            type="date"
            value={form.validade}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-800"
            disabled={isFormDisabled} // Desabilita o input
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFormDisabled} // Desabilita o botão de submit
        >
          {editId ? "Atualizar Cupom" : "Criar Cupom"}
        </button>
      </form>
      <ul className="space-y-3">
        {!loading && cupons.length === 0 && (
          <p className="text-gray-800 dark:text-gray-200">
            Nenhum cupom encontrado. Crie um! 🚀
          </p>
        )}

        {cupons.map((cupom) => (
          <li
            key={cupom.id}
            className="bg-green-100 p-4 rounded shadow hover:bg-green-200 transition cursor-default text-gray-800"
          >
            <p>
              <strong>Código:</strong> {cupom.codigo}
            </p>
            <p>
              <strong>Valor:</strong> R$ {cupom.valor}
            </p>
            <p>
              <strong>Validade:</strong>{" "}
              {new Date(cupom.validade).toLocaleDateString()}
            </p>
            <p>
              <strong>Utilizado:</strong>{" "}
              {cupom.utilizado ? "Sim ✅" : "Não ❌"}
            </p>
            <p>
              <strong>ID do Usuário:</strong> {cupom.userId}
            </p>

            <button
              type="button"
              onClick={() => handleEdit(cupom)}
              className="mr-2 mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormDisabled} // Desabilita o botão de editar
            >
              Editar
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleDelete(cupom.id);
              }}
              className="inline"
            >
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFormDisabled} // Desabilita o botão de deletar
              >
                Deletar
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
