"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import axios from "axios";

type Item = {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // Adicionado conforme schema.prisma
};

export default function ItemPage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [form, setForm] = useState({ titulo: "", descricao: "", userId: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Etado para modal de confirmação
  const [itemToDelete, setItemToDelete] = useState<string | null>(null); 

  // ========================================= LISTAR TODOS OS ITENS (GET /itens) =====================================================
  
  const fetchItens = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null); 
      const response = await api.data.get("/items"); 
      setItens(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao carregar itens: ${message} 😔`);
        console.error("Erro Axios ao buscar itens:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado: ${err.message} 🙁`);
        console.error("Erro inesperado ao buscar itens:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao carregar itens. 🤔");
        console.error("Erro desconhecido ao carregar itens:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

// ============================================= ATUALIZAÇÃO DO FORMULÁRIO ============================================================
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========================================== CRIAR OU ATUALIZAR ITEM ===============================================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.titulo || !form.descricao || !form.userId) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      if (editId) {
        // PUT /itens/:id
        await api.data.put(`/items/${editId}`, form);
        setEditId(null);
      } else {
        // POST /itens
        await api.data.post("/items", form);
      }
      setForm({ titulo: "", descricao: "", userId: ""});
      fetchItens();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao salvar item: ${message} 🙁`);
        console.error("Erro Axios ao salvar item:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado ao salvar item: ${err.message} 😕`);
        console.error("Erro inesperado ao salvar item:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao salvar item. 😕");
        console.error("Erro desconhecido ao salvar item:", err);
      }
    }
  };

  // ======================================================= EDITAR ITEM ==============================================================
  
  const handleEdit = (item: Item) => {
    setEditId(item.id);
    setForm({ titulo: item.titulo, descricao: item.descricao,  userId: item.userId });
  };

  // ======================================================== DELETAR ITEM ============================================================
 
  const handleDeleteConfirm = (id: string) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setError(null);
    if (!itemToDelete) return;

    try {
      await api.data.delete(`/items/${itemToDelete}`);
      fetchItens();
      setShowConfirmModal(false);
      setItemToDelete(null);
    } catch (err: unknown) {
       if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(`Erro ao deletar item: ${message} 🙁`);
        console.error("Erro Axios ao deletar item:", err);
      } else if (err instanceof Error) {
        setError(`Ocorreu um erro inesperado ao deletar item: ${err.message} 😕`);
        console.error("Erro inesperado ao deletar item:", err);
      } else {
        setError("Ocorreu um erro desconhecido ao deletar item. 😕");
        console.error("Erro desconhecido ao deletar item:", err);
      }
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

    // ======================================================== INTERFACE =============================================================

  const isFormDisabled = !!error; // Desabilita o formulário se houver um erro geral

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Carregando itens... ⏳</p>
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
            onClick={fetchItens}
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
        Gerenciar Itens 📦
      </h1>

      {/* Formulário de Criação/Edição */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 mb-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editId ? "Editar Item" : "Novo Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-gray-700 text-sm font-semibold mb-2">
              Título:
            </label>
            <input
              name="titulo"
              id="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              disabled={isFormDisabled}
              placeholder="Ex: Camisa Social Azul"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-gray-700 text-sm font-semibold mb-2">
              Descrição:
            </label>
            <textarea
              name="descricao"
              id="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 h-24 resize-y"
              disabled={isFormDisabled}
              placeholder="Descreva o item, estado de conservação, etc."
            />
          </div>

          <div>
            <label htmlFor="userId" className="block text-gray-700 text-sm font-semibold mb-2">
              ID do Usuário Doador:
            </label>
            <input
              name="userId"
              id="userId"
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
              {editId ? "Atualizar Item" : "Criar Item"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ titulo: "", descricao: "", userId: "" });
                }}
                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Itens */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Itens Cadastrados
        </h2>
        {itens.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Nenhum item encontrado. Crie um! 🚀
          </p>
        ) : (
          <ul className="space-y-4">
            {itens.map((item) => (
              <li
                key={item.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <p className="text-gray-800">
                  <strong>Título:</strong> {item.titulo}
                </p>
                <p className="text-gray-800">
                  <strong>Descrição:</strong> {item.descricao}
                </p>
                <p className="text-gray-800">
                  <strong>Status:</strong> {item.status || "N/A"}
                </p>
                <p className="text-gray-800">
                  <strong>Criado em:</strong>{" "}
                  {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-gray-800">
                  <strong>Atualizado em:</strong>{" "}
                  {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-gray-800">
                  <strong>ID do Doador:</strong> {item.userId}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className=" bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(item.id)} // Chama o modal de confirmação
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
            <p className="text-gray-700 mb-6">Tem certeza que deseja deletar este item?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete} // Confirma a exclusão
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
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
