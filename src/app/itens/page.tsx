"use client";

import React, { useState, useEffect } from "react";
import api from "../../axios"; 
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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


}