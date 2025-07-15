
"use client";

import React, { useState, useEffect } from "react";
import api from "../../axios";

type Cupom = {
  id: string;
  codigo: string;
  valor: number;
  validade: string;
};

export default function CupomPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [form, setForm] = useState({ codigo: "", valor: "", validade: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Pega todos os cupons (GET)
  const fetchCupons = async () => {
    try {
      const response = await api.get("/cupons");
      setCupons(response.data);
    } catch (err) {
      console.error("Erro ao buscar cupons:", err);
      setError("Erro ao carregar cupons.");
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
    setError("");

    if (!form.codigo || !form.valor || !form.validade) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      if (editId) {
        // Editar cupom
        await api.put(`/cupons/${editId}`, {
          codigo: form.codigo,
          valor: Number(form.valor),
          validade: form.validade,
        });
        setEditId(null);
      } else {
        // Criar cupom
        await api.post("/cupons", {
          codigo: form.codigo,
          valor: Number(form.valor),
          validade: form.validade,
          userId: "1", // Coloca um userId fixo só pra exemplo
        });
      }
      setForm({ codigo: "", valor: "", validade: "" });
      fetchCupons();
    } catch (err) {
      console.error("Erro ao salvar cupom:", err);
      setError("Erro ao salvar cupom.");
    }
  };

  // Preparar form para editar sem onClick, usando botão submit dentro de um form
  const handleEdit = (cupom: Cupom) => {
    setEditId(cupom.id);
    setForm({
      codigo: cupom.codigo,
      valor: cupom.valor.toString(),
      validade: cupom.validade.slice(0, 10), // formato yyyy-mm-dd para input date
    });
  };

  // Deletar cupom sem onClick, usando form com botão submit
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/cupons/${id}`);
      fetchCupons();
    } catch (err) {
      console.error("Erro ao deletar cupom:", err);
      setError("Erro ao deletar cupom.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Cupons</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-green-50 p-4 rounded shadow">
        <div>
          <label className="block font-semibold" htmlFor="codigo">Código</label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            value={form.codigo}
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
          <label className="block font-semibold" htmlFor="validade">Validade</label>
          <input
            id="validade"
            name="validade"
            type="date"
            value={form.validade}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? "Atualizar Cupom" : "Criar Cupom"}
        </button>
      </form>

      <ul className="space-y-3">
        {cupons.length === 0 && <p>Nenhum cupom encontrado.</p>}

        {cupons.map((cupom) => (
          <li
            key={cupom.id}
            className="bg-green-100 p-4 rounded shadow hover:bg-green-200 transition cursor-default"
          >
            <p><strong>Código:</strong> {cupom.codigo}</p>
            <p><strong>Valor:</strong> R$ {cupom.valor}</p>
            <p><strong>Validade:</strong> {new Date(cupom.validade).toLocaleDateString()}</p>

            {/* Form para editar (não pode ter onClick, então chamamos função direta) */}
            <button
              type="button"
              onClick={() => handleEdit(cupom)}
              className="mr-2 mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Editar
            </button>

            {/* Form para deletar sem onClick, usando form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleDelete(cupom.id);
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
