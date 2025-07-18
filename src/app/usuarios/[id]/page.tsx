"use client"; // 🧑‍💻 Indica que este é um Client Component

import React, { useState, useEffect } from "react"; // 🎣 Importa hooks essenciais do React
import { useParams } from "next/navigation"; // 🧭 Hook do Next.js para pegar parâmetros dinâmicos da URL (ex: o 'id' do usuário)
import Link from "next/link"; // 🔗 Componente do Next.js para navegação
import api from "@/lib/api"; // 🔗 Importa a instância configurada do Axios (Caminho CORRETO para api.ts)
import { ApiUser } from "@/app/usuarios/utils/userValidation"; // 📚 Importa o tipo 'ApiUser' do seu schema de validação para tipagem segura
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

const UserProfilePage: React.FC = () => {
  // 🧭 Extrai o 'id' do usuário da URL, que vem da estrutura de rota '[id]'
  const params = useParams();
  const userId = params.id as string; // Garante que 'userId' é uma string

  // 📊 Estados para gerenciar os dados do usuário, carregamento e erros
  const [user, setUser] = useState<ApiUser | null>(null); // 📦 Armazena os dados do usuário buscado
  const [loading, setLoading] = useState(true); // ⏳ Indica se os dados estão sendo carregados
  const [error, setError] = useState<string | null>(null); // ❌ Armazena mensagens de erro, se houver

  // 🚀 Efeito colateral para buscar os dados do usuário quando o componente é montado ou o 'userId' muda
  useEffect(() => {
    // 🛡️ Se não houver userId na URL (acontece em algumas transições ou URLs malformadas), para o carregamento
    if (!userId) {
      setLoading(false);
      return;
    }

    // 📨 Função assíncrona para buscar o usuário na API
    const fetchUser = async () => {
      try {
        setLoading(true); // Inicia o estado de carregamento
        setError(null); // Limpa qualquer erro anterior
        // 🎯 Faz uma requisição GET para o endpoint da API: /users/:id
        const response = await api.data.get<ApiUser>(`/users/${userId}`); // 🎯 CORRETO: Usando api.data.get
        setUser(response.data); // ✅ Agora 'response.data' é do tipo ApiUser correto
      } catch (err: unknown) {
        // 🎯 CORRETO: Usando 'unknown' para tipagem segura
        if (axios.isAxiosError(err)) {
          console.error(
            "Erro ao buscar perfil do usuário:",
            err.response?.data || err.message
          );
          setError("Falha ao carregar o perfil do usuário. 😥");
        } else if (err instanceof Error) {
          console.error(
            "Erro desconhecido ao buscar perfil do usuário:",
            err.message
          );
          setError(
            "Ocorreu um erro inesperado ao carregar o perfil do usuário. 😥"
          );
        } else {
          console.error("Erro não identificado ao buscar perfil do usuário.");
          setError("Ocorreu um erro desconhecido. 😥");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // 🔄 O efeito é re-executado sempre que o 'userId' na URL muda

  // ⏳ Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-700">
        Carregando perfil do usuário... ⏳
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg font-semibold">
        {error} 💔
      </div>
    );
  }

  // 🤔 Renderiza uma mensagem se o usuário não for encontrado após o carregamento
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Usuário não encontrado ou não existe. 🤷‍♀️
      </div>
    );
  }

  // 👤 Renderiza os detalhes do perfil do usuário quando os dados são carregados com sucesso
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* 💳 Cartão de perfil com estilos Tailwind */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-reuse-blue">
          Perfil de {user.nome} ✨
        </h1>
        <div className="space-y-4">
          {" "}
          {/* Espaçamento entre os parágrafos */}
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-700">Nome:</strong>{" "}
            {user.nome}
          </p>
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-700">E-mail:</strong>{" "}
            {user.email}
          </p>
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-700">
              Tipo de Usuário:
            </strong>{" "}
            {user.tipo_usuario}{" "}
            {/* ✅ Agora 'tipo_usuario' existe em ApiUser */}
          </p>
          {/* Você pode adicionar mais campos do perfil aqui, como telefone, endereço, etc. */}
        </div>
        {/* ✏️ Botão para navegar para a página de edição do usuário */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/usuarios/${user.id}/edit`} // 🎯 Link para a nova página de edição (usando user.id)
            className="inline-block bg-reuse-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
          >
            Editar Perfil ✏️
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
