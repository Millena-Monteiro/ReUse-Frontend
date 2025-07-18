"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import axios, { AxiosError } from "axios";

interface UserInfoForPagamento {
  nome: string;
  email: string;
  id?: string;
}

type Pagamento = {
  id: string;
  valor: number;
  metodo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: UserInfoForPagamento;
  userId: string;
};

export default function PagamentoPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [form, setForm] = useState({
    valor: "",
    metodo: "",
    status: "",
    userId: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPagamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.data.get<Pagamento[]>("/pagamentos");
      setPagamentos(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao buscar pagamentos:",
          err.response?.data || err.message
        );
        setError(
          "Erro ao carregar pagamentos. Verifique a API de pagamentos. 😔"
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao buscar pagamentos:", err.message);
        setError("Ocorreu um erro inesperado ao carregar pagamentos. 😔");
      } else {
        console.error("Erro não identificado ao buscar pagamentos.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.valor || !form.metodo || !form.userId) {
      setError(
        "Preencha todos os campos obrigatórios (Valor, Método, ID do Usuário). ⚠️"
      );
      return;
    }

    try {
      if (editId) {
        await api.data.put(`/pagamentos/${editId}`, {
          valor: Number(form.valor),
          metodo: form.metodo,
          status: form.status,
        });
        setEditId(null);
      } else {
        await api.data.post("/pagamentos", {
          valor: Number(form.valor),
          metodo: form.metodo,
          status: form.status || "pendente",
          userId: form.userId,
        });
      }
      setForm({ valor: "", metodo: "", status: "", userId: "" });
      fetchPagamentos();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao salvar pagamento:",
          err.response?.data || err.message
        );
        setError(
          "Erro ao salvar pagamento: " +
            (err.response?.data?.erro ||
              err.message ||
              "Verifique os logs do backend. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao salvar pagamento:", err.message);
        setError("Ocorreu um erro inesperado ao salvar pagamento. 😔");
      } else {
        console.error("Erro não identificado ao salvar pagamento.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  const handleEdit = (pagamento: Pagamento) => {
    setEditId(pagamento.id);
    setForm({
      valor: pagamento.valor.toString(),
      metodo: pagamento.metodo,
      status: pagamento.status,
      userId: pagamento.userId,
    });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    if (!window.confirm("Tem certeza que deseja deletar este pagamento?")) {
      return;
    }
    try {
      await api.data.delete(`/pagamentos/${id}`);
      fetchPagamentos();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao deletar pagamento:",
          err.response?.data || err.message
        );
        setError(
          "Erro ao deletar pagamento: " +
            (err.response?.data?.erro ||
              err.message ||
              "Verifique os logs do backend. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao deletar pagamento:", err.message);
        setError("Ocorreu um erro inesperado ao deletar pagamento. 😔");
      } else {
        console.error("Erro não identificado ao deletar pagamento.");
        setError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  const isFormDisabled = !!error;

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Gerenciar Pagamentos
      </h1>

      {loading && (
        <p className="text-blue-500 mb-2">Carregando pagamentos... ⏳</p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {isFormDisabled && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Atenção!</strong>
          <span className="block sm:inline">
            {" "}
            A funcionalidade de criar/editar pagamentos está temporariamente
            indisponível devido a um problema na comunicação com o backend.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`mb-6 space-y-2 bg-blue-50 p-4 rounded shadow ${
          isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
        } dark:bg-gray-700`}
      >
        <div>
          <label
            className="block font-semibold text-gray-900 dark:text-gray-50"
            htmlFor="valor"
          >
            Valor (R$)
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-900 bg-white dark:text-gray-50 dark:bg-gray-800 dark:border-gray-600"
            min="0"
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            className="block font-semibold text-gray-900 dark:text-gray-50"
            htmlFor="metodo"
          >
            Método
          </label>
          <select
            id="metodo"
            name="metodo"
            value={form.metodo}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-900 bg-white dark:text-gray-50 dark:bg-gray-800 dark:border-gray-600"
            disabled={isFormDisabled}
          >
            <option value="">Selecione o Método</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="boleto">Boleto</option>
            <option value="pix">Pix</option>
          </select>
        </div>

        <div>
          <label
            className="block font-semibold text-gray-900 dark:text-gray-50"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-900 bg-white dark:text-gray-50 dark:bg-gray-800 dark:border-gray-600"
            disabled={isFormDisabled}
          >
            <option value="">Selecione o Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>

        <div>
          <label
            className="block font-semibold text-gray-900 dark:text-gray-50"
            htmlFor="userId"
          >
            ID do Usuário
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            value={form.userId}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-gray-900 bg-white dark:text-gray-50 dark:bg-gray-800 dark:border-gray-600"
            disabled={isFormDisabled}
            placeholder="Ex: clx000000000000000000000"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFormDisabled}
        >
          {editId ? "Atualizar Pagamento" : "Criar Pagamento"}
        </button>
      </form>

      <ul className="space-y-3">
        {!loading && pagamentos.length === 0 && (
          <p className="text-gray-800 dark:text-gray-200">
            Nenhum pagamento encontrado. Crie um! 🚀
          </p>
        )}

        {pagamentos.map((pagamento) => (
          <li
            key={pagamento.id}
            className="bg-blue-100 p-4 rounded shadow hover:bg-blue-200 transition cursor-default text-gray-900 dark:bg-gray-800 dark:text-white"
          >
            <p className="text-gray-900 dark:text-white">
              <strong>Valor:</strong> R$ {pagamento.valor}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Método:</strong> {pagamento.metodo}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Status:</strong> {pagamento.status}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Usuário:</strong> {pagamento.user?.nome || "Desconhecido"}{" "}
              ({pagamento.user?.email || "N/A"})
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>ID do Usuário:</strong> {pagamento.userId}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Data:</strong>{" "}
              {new Date(pagamento.createdAt).toLocaleDateString()}
            </p>

            <button
              type="button"
              onClick={() => handleEdit(pagamento)}
              className="mr-2 mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormDisabled}
            >
              Editar
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleDelete(pagamento.id);
              }}
              className="inline"
            >
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFormDisabled}
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
