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