"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import axios from "axios";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pagamentoToDelete, setPagamentoToDelete] = useState<string | null>(null); // ID para deletar

  const fetchPagamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.data.get<Pagamento[]>("/pagamentos");
      setPagamentos(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao carregar pagamentos: ${message} 😔`);
        console.error("Erro Axios ao buscar pagamentos:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado: ${err.message} 😔`);
        console.error("Erro inesperado ao buscar pagamentos:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao carregar pagamentos. 😔");
        console.error("Erro desconhecido ao carregar pagamentos:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPagamentos();
  }, [fetchPagamentos]);

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
        const message = err.response?.data?.message || err.message;
        setError(
          `Erro ao salvar pagamento: ${
            message || "Verifique os logs do backend."
          } 🤔`
        );
        console.error("Erro Axios ao salvar pagamento:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado ao salvar pagamento: ${err.message} 😕`);
        console.error("Erro inesperado ao salvar pagamento:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao salvar pagamento. 🙁");
        console.error("Erro desconhecido ao salvar pagamento:", err);
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

  const handleDeleteConfirm = (id: string) => {
    setPagamentoToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setError(null);
    if (!pagamentoToDelete) return;

    try {
      await api.data.delete(`/pagamentos/${pagamentoToDelete}`);
      fetchPagamentos();
      setShowConfirmModal(false);
      setPagamentoToDelete(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(
          `Erro ao deletar pagamento: ${
            message || "Verifique os logs do backend."
          } 😥`
        );
        console.error("Erro Axios ao deletar pagamento:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado ao deletar pagamento: ${err.message} 🙁`);
        console.error("Erro inesperado ao deletar pagamento:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao deletar pagamento. 🙁");
        console.error("Erro não identificado ao deletar pagamento:", err);
      }
      setShowConfirmModal(false);
      setPagamentoToDelete(null);
    }
  };


  const isFormDisabled = !!error;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Carregando pagamentos... ⏳</p>
        <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns segundos.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto max-w-md text-center border border-red-200">
          <p className="text-2xl text-red-700 font-bold mb-4">Ops! Algo deu errado.</p>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchPagamentos}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Atualizar Página
          </button>
          <p className="text-sm text-gray-500 mt-4">Se o problema persistir, entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Gerenciar Pagamentos 💳
      </h1>

      {/* Formulário de Criação/Edição */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 mb-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editId ? "Editar Pagamento" : "Novo Pagamento"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="valor"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Valor (R$):
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              value={form.valor}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              min="0"
              disabled={isFormDisabled}
              placeholder="Ex: 10.50"
            />
          </div>

          <div>
            <label
              htmlFor="metodo"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Método:
            </label>
            <select
              id="metodo"
              name="metodo"
              value={form.metodo}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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
              htmlFor="status"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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
              htmlFor="userId"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              ID do Usuário:
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              value={form.userId}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              disabled={isFormDisabled}
              placeholder="Ex: clx000000000000000000000"
            />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className=" bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2"
              disabled={isFormDisabled}
            >
              {editId ? "Atualizar Pagamento" : "Criar Pagamento"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ valor: "", metodo: "", status: "", userId: "" });
                }}
                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Histórico de Pagamentos
        </h2>
        {pagamentos.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Nenhum pagamento encontrado. Crie um! 🚀
          </p>
        ) : (
          <ul className="space-y-4">
            {pagamentos.map((pagamento) => (
              <li
                key={pagamento.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <p className="text-gray-800">
                  <strong>Valor:</strong> R$ {pagamento.valor.toFixed(2)}
                </p>
                <p className="text-gray-800">
                  <strong>Método:</strong> {pagamento.metodo}
                </p>
                <p className="text-gray-800">
                  <strong>Status:</strong> {pagamento.status}
                </p>
                <p className="text-gray-800">
                  <strong>Usuário:</strong> {pagamento.user?.nome || "Desconhecido"}{" "}
                  ({pagamento.user?.email || "N/A"})
                </p>
                <p className="text-gray-800">
                  <strong>ID do Usuário:</strong> {pagamento.userId}
                </p>
                <p className="text-gray-800">
                  <strong>Data:</strong>{" "}
                  {new Date(pagamento.createdAt).toLocaleDateString("pt-BR")}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(pagamento)}
                    className=" bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(pagamento.id)}
                    className=" bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2"
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão (Placeholder) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">Tem certeza que deseja deletar este pagamento?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete} // Confirma a exclusão
                className=" bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2"
              >
                Sim, Deletar
              </button>
              <button
                onClick={() => setShowConfirmModal(false)} // Cancela
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
