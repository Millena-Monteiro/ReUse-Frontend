"use client";

import React, { useState, useEffect } from "react";
import api from "../../axios";

type Pagamento = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
};

export default function PagamentoPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [form, setForm] = useState({ descricao: "", valor: "", data: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch all payments (GET)
  const fetchPagamentos = async () => {
    try {
      const response = await api.get("/pagamentos");
      setPagamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar pagamentos:", err);
      setError("Erro ao carregar pagamentos.");
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  // update form state (controlled inputs)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create payment (POST) or edit payment (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.descricao || !form.valor || !form.data) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/pagamentos/${editId}`, {
          descricao: form.descricao,
          valor: Number(form.valor),
          data: form.data,
        });
        setEditId(null);
      } else {
        await api.post("/pagamentos", {
          descricao: form.descricao,
          valor: Number(form.valor),
          data: form.data,
          userId: "", 
        });
      }
      setForm({ descricao: "", valor: "", data: "" });
      fetchPagamentos();
    } catch (err) {
      console.error("Erro ao salvar pagamento:", err);
      setError("Erro ao salvar pagamento.");
    }
  };

  // Edit payment
  const handleEdit = (pagamento: Pagamento) => {
    setEditId(pagamento.id);
    setForm({
      descricao: pagamento.descricao,
      valor: pagamento.valor.toString(),
      data: pagamento.data.slice(0, 10),
    });
  };

  // Delete payment
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/pagamentos/${id}`);
      fetchPagamentos();
    } catch (err) {
      console.error("Erro ao deletar pagamento:", err);
      setError("Erro ao deletar pagamento.");
    }
  };



  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Pagamentos</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-blue-50 p-4 rounded shadow">
        <div>
          <label className="block font-semibold" htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block font-semibold" htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-semibold" htmlFor="data">Data</label>
          <input
            id="data"
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Atualizar Pagamento" : "Criar Pagamento"}
        </button>
      </form>

      <ul className="space-y-3">
        {pagamentos.length === 0 && <p>Nenhum pagamento encontrado.</p>}

        {pagamentos.map((pagamento) => (
          <li
            key={pagamento.id}
            className="bg-blue-100 p-4 rounded shadow hover:bg-blue-200 transition cursor-default"
          >
            <p><strong>Descrição:</strong> {pagamento.descricao}</p>
            <p><strong>Valor:</strong> R$ {pagamento.valor}</p>
            <p><strong>Data:</strong> {new Date(pagamento.data).toLocaleDateString()}</p>

            <button
              type="button"
              onClick={() => handleEdit(pagamento)}
              className="mr-2 mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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