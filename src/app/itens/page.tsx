"use client";

import React, { useState, useEffect } from "react";
import api from "../../axios"; 

type Item = {
  id: string;
  nome: string;
  descricao: string;
};

export default function ItemPage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");


  // ========================================= LISTAR TODOS OS ITENS (GET /itens) =====================================================
  
  const fetchItens = async () => {
    try {
      const response = await api.get("/itens");
      setItens(response.data);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
      setError("Erro ao carregar itens.");
    }
  };

    useEffect(() => {
    fetchItens();
  }, []);


// ============================================= ATUALIZAÇÃO DO FORMULÁRIO ============================================================
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========================================== CRIAR OU ATUALIZAR ITEM ===============================================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nome || !form.descricao) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      if (editId) {
        // PUT /itens/:id
        await api.put(`/itens/${editId}`, form);
        setEditId(null);
      } else {
        // POST /itens
        await api.post("/itens", form);
      }
      setForm({ nome: "", descricao: "" });
      fetchItens();
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      setError("Erro ao salvar item.");
    }
  };

  // ======================================================= EDITAR ITEM ==============================================================
  
  const handleEdit = (item: Item) => {
    setEditId(item.id);
    setForm({ nome: item.nome, descricao: item.descricao });
  };

  // ======================================================== DELETAR ITEM ============================================================
 
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/itens/${id}`);
      fetchItens();
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      setError("Erro ao deletar item.");
    }
  };

    // ======================================================== INTERFACE =============================================================

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Itens</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-green-50 p-4 rounded shadow">
        <div>
          <label className="block font-semibold" htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block font-semibold" htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? "Atualizar Item" : "Criar Item"}
        </button>
      </form>

      {/* Lista de itens */}
      <ul className="space-y-3">
        {itens.length === 0 && <p>Nenhum item encontrado.</p>}

        {itens.map((item) => (
          <li
            key={item.id}
            className="bg-green-100 p-4 rounded shadow hover:bg-green-200 transition cursor-default"
          >
            <p><strong>Nome:</strong> {item.nome}</p>
            <p><strong>Descrição:</strong> {item.descricao}</p>

            <button
              type="button"
              onClick={() => handleEdit(item)}
              className="mr-2 mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Editar
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleDelete(item.id);
              }}
              className="inline"
            >
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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