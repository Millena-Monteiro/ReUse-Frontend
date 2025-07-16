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
}