"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import axios from "axios";

// --- DEFINIÇÃO DO TIPO DE HISTÓRICO REAL ---
type Historico = {
  id: string;
  item_id: string;
  receptor_id: string;
  doador_id: string;
  data_transacao: string;
  tipo: string;
};

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [form, setForm] = useState({
    item_id: "",
    receptor_id: "",
    doador_id: "",
    data_transacao: "",
    tipo: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistorico = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.data.get<Historico[]>("/historicos");
      setHistorico(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao carregar histórico: ${message} 🙁`);
        console.error("Erro Axios ao carregar histórico:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado: ${err.message} 😕`);
        console.error("Erro inesperado ao carregar histórico:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao carregar histórico. 🤔");
        console.error("Erro desconhecido ao carregar histórico:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !form.item_id ||
      !form.receptor_id ||
      !form.doador_id ||
      !form.data_transacao ||
      !form.tipo
    ) {
      setError("Preencha todos os campos. ⚠️");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        data_transacao: new Date(form.data_transacao).toISOString(),
      };

      if (editId) {
        await api.data.put(`/historicos/${editId}`, dataToSend); // 💡 Removido 'api/' no path
      } else {
        await api.data.post("/historicos", dataToSend);
      }
      setForm({
        item_id: "",
        receptor_id: "",
        doador_id: "",
        data_transacao: "",
        tipo: "",
      });
      fetchHistorico();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao salvar histórico: ${message} 😔`);
        console.error("Erro Axios ao salvar histórico:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado: ${err.message} 😕`);
        console.error("Erro inesperado ao salvar histórico:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao salvar histórico. 🤔");
        console.error("Erro desconhecido ao salvar histórico:", err);
      }
    }
  };

  const handleEdit = (item: Historico) => {
    setEditId(item.id);
    setForm({
      item_id: item.item_id,
      receptor_id: item.receptor_id,
      doador_id: item.doador_id,
      data_transacao: item.data_transacao.slice(0, 10),
      tipo: item.tipo,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.data.delete(`api/historicos/${id}`);
      fetchHistorico();
    } catch (err: unknown) {
      // 💡
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao deletar histórico: ${message} 😔`);
        console.error("Erro Axios ao deletar histórico:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado ao deletar: ${err.message} 😔`);
        console.error("Erro inesperado ao deletar histórico:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao deletar histórico. 😔");
        console.error("Erro desconhecido ao deletar histórico:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">
          Carregando histórico...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  // Renderização condicional para estados de erro
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto max-w-md text-center border border-red-200">
          <p className="text-2xl text-red-700 font-bold mb-4">
            Ops! Algo deu errado.
          </p>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchHistorico}
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
        Gerenciar Histórico de Transações
      </h1>

      {/* Formulário de Criação/Edição */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 mb-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editId ? "Editar Transação" : "Nova Transação"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="item_id"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Item ID:
            </label>
            <input
              name="item_id"
              id="item_id"
              value={form.item_id}
              onChange={handleChange}
              placeholder="ID do Item"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="receptor_id"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Receptor ID:
            </label>
            <input
              name="receptor_id"
              id="receptor_id"
              value={form.receptor_id}
              onChange={handleChange}
              placeholder="ID do Receptor"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="doador_id"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Doador ID:
            </label>
            <input
              name="doador_id"
              id="doador_id"
              value={form.doador_id}
              onChange={handleChange}
              placeholder="ID do Doador"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="data_transacao"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Data da Transação:
            </label>
            <input
              type="date"
              name="data_transacao"
              id="data_transacao"
              value={form.data_transacao}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="tipo"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Tipo:
            </label>
            <input
              name="tipo"
              id="tipo"
              value={form.tipo}
              onChange={handleChange}
              placeholder="Tipo de Transação"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            >
              {editId ? "Atualizar Histórico" : "Criar Histórico"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    item_id: "",
                    receptor_id: "",
                    doador_id: "",
                    data_transacao: "",
                    tipo: "",
                  });
                }}
                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Histórico */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Histórico de Transações
        </h2>
        {historico.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Nenhum histórico encontrado.
          </p>
        ) : (
          <ul className="space-y-4">
            {historico.map((item) => (
              <li
                key={item.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <p className="text-gray-800">
                  <strong>Item ID:</strong> {item.item_id}
                </p>
                <p className="text-gray-800">
                  <strong>Receptor ID:</strong> {item.receptor_id}
                </p>
                <p className="text-gray-800">
                  <strong>Doador ID:</strong> {item.doador_id}
                </p>
                <p className="text-gray-800">
                  <strong>Data:</strong>{" "}
                  {new Date(item.data_transacao).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-gray-800">
                  <strong>Tipo:</strong> {item.tipo}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
