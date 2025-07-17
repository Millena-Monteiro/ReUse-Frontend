"use client";

import React, { useState, useEffect } from "react";
import api from "../../axios";

// Tipo para histórico de transações
interface Historico {
  id: string;
  item_id: string;
  receptor_id: string;
  doador_id: string;
  data_transacao: string;
  tipo: "doacao" | "troca";
}

export default function HistoricoPage() {
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [form, setForm] = useState({
    item_id: "",
    receptor_id: "",
    doador_id: "",
    data_transacao: "",
    tipo: "doacao",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchHistoricos = async () => {
    try {
      const response = await api.get("api/historicos");
      setHistoricos(response.data);
    } catch (err) {
      console.error("Erro ao buscar históricos:", err);
      setError("Erro ao carregar históricos.");
    }
  };

  useEffect(() => {
    fetchHistoricos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { item_id, receptor_id, doador_id, data_transacao, tipo } = form;

    if (!item_id || !receptor_id || !doador_id || !data_transacao || !tipo) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      if (editId) {
        await api.put(`api/historicos/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("api/historicos", form);
      }
      setForm({ item_id: "", receptor_id: "", doador_id: "", data_transacao: "", tipo: "doacao" });
      fetchHistoricos();
    } catch (err) {
      console.error("Erro ao salvar histórico:", err);
      setError("Erro ao salvar histórico.");
    }
  };

  const handleEdit = (historico: Historico) => {
    setEditId(historico.id);
    setForm({
      item_id: historico.item_id,
      receptor_id: historico.receptor_id,
      doador_id: historico.doador_id,
      data_transacao: historico.data_transacao.slice(0, 10),
      tipo: historico.tipo,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`api/historicos/${id}`);
      fetchHistoricos();
    } catch (err) {
      console.error("Erro ao deletar histórico:", err);
      setError("Erro ao deletar histórico.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Histórico de Transações</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2 bg-gray-100 p-4 rounded shadow mb-6">
        <input name="item_id" placeholder="ID do Item" value={form.item_id} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        <input name="receptor_id" placeholder="ID do Receptor" value={form.receptor_id} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        <input name="doador_id" placeholder="ID do Doador" value={form.doador_id} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        <input name="data_transacao" type="date" value={form.data_transacao} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="doacao">Doação</option>
          <option value="troca">Troca</option>
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editId ? "Atualizar Histórico" : "Criar Histórico"}
        </button>
      </form>

      <ul className="space-y-3">
        {historicos.length === 0 && <p>Nenhuma transação encontrada.</p>}

        {historicos.map((h) => (
          <li key={h.id} className="bg-green-100 p-4 rounded shadow hover:bg-green-200 transition">
            <p><strong>Tipo:</strong> {h.tipo}</p>
            <p><strong>Item:</strong> {h.item_id}</p>
            <p><strong>Doador:</strong> {h.doador_id}</p>
            <p><strong>Receptor:</strong> {h.receptor_id}</p>
            <p><strong>Data:</strong> {new Date(h.data_transacao).toLocaleDateString()}</p>

            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(h)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Editar
              </button>
              <button onClick={() => handleDelete(h.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
