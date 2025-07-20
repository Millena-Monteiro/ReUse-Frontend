"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { ApiUser } from "@/app/usuarios/utils/userValidation";
import axios, { AxiosError } from "axios";

const UserProfilePage: React.FC = () => {
  // 🧭 Extrai o 'id' do usuário da URL, que vem da estrutura de rota '[id]'
  const params = useParams();
  const userId = params.id as string;

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
        const response = await api.data.get<ApiUser>(`/users/${userId}`);
        setUser(response.data); // Atualiza o estado com os dados do usuário
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Erro ao buscar perfil do usuário:",
            err.response?.data || err.message
          ); // Loga o erro no console
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
  }, [userId]); // O efeito é re-executado sempre que o 'userId' na URL muda

  // ⏳ Renderiza um indicador de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-lg font-medium text-gray-700">
        Carregando perfil do usuário... ⏳
      </div>
    );
  }

  // ❌ Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-red-600 text-lg font-semibold">
        {error} 💔
      </div>
    );
  }

  // 🤔 Renderiza uma mensagem se o usuário não for encontrado após o carregamento
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-gray-600 text-lg">
        Usuário não encontrado ou não existe. 🤷‍♀️
      </div>
    );
  }

  // 👤 Renderiza os detalhes do perfil do usuário quando os dados são carregados com sucesso
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4 font-inter">
      {/* 💳 Cartão de perfil com estilos Tailwind */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-md border border-gray-200 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8  text-gray-800">
          Perfil de {user.nome}{" "}
          <span role="img" aria-label="user icon">
            👤
          </span>
        </h1>
        <div className="space-y-5">
          <p className="text-lg text-gray-800 flex items-center">
            <strong className="font-semibold text-gray-700 mr-2">Nome:</strong>{" "}
            {user.nome}
          </p>
          <p className="text-lg text-gray-800 flex items-center">
            <strong className="font-semibold text-gray-700 mr-2">
              E-mail:
            </strong>{" "}
            {user.email}
          </p>
          <p className="text-lg text-gray-800 flex items-center">
            <strong className="font-semibold text-gray-700 mr-2">
              Tipo de Usuário:
            </strong>{" "}
            {user.tipo_usuario}
          </p>
        </div>
        {/* ✏️ Botão para navegar para a página de edição do usuário */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`/usuarios/${user.id}/edit`} // 🎯 Link para a nova página de edição
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75"
          >
            Editar Perfil{" "}
            <span role="img" aria-label="pencil icon">
              ✏️
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
