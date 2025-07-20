"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ApiUser } from "@/app/usuarios/utils/userValidation";
import axios, { AxiosError } from "axios";

const UsuariosPage: React.FC = () => {
  // 📊 Estados para gerenciar os dados dos usuários, carregamento e erros
  const [usuarios, setUsuarios] = useState<ApiUser[]>([]); // 📦 Array para armazenar os usuários buscados
  const [loading, setLoading] = useState<boolean>(true); // ⏳ Estado para indicar se os dados estão sendo carregados
  const [error, setError] = useState<string | null>(null); // ❌ Estado para armazenar mensagens de erro, se houver

  // 🚀 Efeito colateral para buscar os usuários da API quando o componente é montado
  useEffect(() => {
    // 📨 Função assíncrona para buscar a lista de usuários
    const fetchUsuarios = async () => {
      try {
        setLoading(true); // Inicia o estado de carregamento
        setError(null); // Limpa qualquer erro anterior
        // 🎯 Faz uma requisição GET para o endpoint '/users' da API (conforme seu backend)
        const response = await api.data.get("/users");
        setUsuarios(response.data); // ✅ Atualiza o estado com os dados recebidos da API
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Erro ao buscar usuários:",
            err.response?.data || err.message
          );
          setError(
            "O carregamento dos usuários está lento ou houve um problema temporário. Tente novamente ou atualize a página. 🔄"
          );
        } else if (err instanceof Error) {
          console.error("Erro desconhecido ao buscar usuários:", err.message);
          setError("Ocorreu um erro inesperado ao carregar os usuários. 😔");
        } else {
          console.error("Erro não identificado ao buscar usuários.");
          setError("Ocorreu um erro desconhecido. 😔");
        }
      } finally {
        setLoading(false); // 🏁 Finaliza o carregamento, independentemente do sucesso ou falha
      }
    };

    fetchUsuarios(); // 🏃 Chama a função de busca ao montar o componente
  }, []); // 📌 O array vazio [] garante que este useEffect rode APENAS uma vez, na montagem inicial.

  // 🔄 Renderização condicional baseada nos estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">
          Carregando usuários...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Isso pode levar alguns segundos, especialmente se o servidor estiver
          "dormindo".
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto max-w-md text-center border border-red-200">
          <p className="text-2xl text-red-700 font-bold mb-4">
            Ops! Algo deu errado.
          </p>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()} // 🔄 AQUI: Função para recarregar a página
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Atualizar Página
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  // 📄 Renderização da lista de usuários
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Lista de Usuários ReUSE 🧑‍🤝‍🧑
      </h1>
      {usuarios.length === 0 ? ( // 🤷‍♀️ Verifica se não há usuários
        <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg mx-auto">
          <p className="text-lg text-gray-600 mb-4">
            Nenhum usuário encontrado. Crie um! 🚀
          </p>
          {/* Posteriormente adicionar um botão para criar usuário aqui */}
          <button
            onClick={() =>
              alert("Funcionalidade de criar usuário (a ser implementada)")
            }
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 mt-4"
          >
            Criar Novo Usuário
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 📐 Grid responsivo para organizar os cards */}
          {usuarios.map(
            (
              usuario // 🗺️ Mapeia cada usuário para um card
            ) => (
              <div
                key={usuario.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-200 relative"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
                    {usuario.nome}
                  </h2>{" "}
                  {/* 🏷️ Nome do usuário (trunca se for muito longo) */}
                  <p className="text-gray-600 text-base mb-1">
                    Email:{" "}
                    <span className="font-medium text-gray-700">
                      {usuario.email}
                    </span>
                  </p>{" "}
                  {/* ✉️ Email do usuário */}
                  {/* 👤 Tipo de Usuário */}
                  <p className="text-gray-600 text-base mb-1">
                    Tipo:{" "}
                    <span className="font-medium text-gray-700 capitalize">
                      {usuario.tipo_usuario}
                    </span>
                  </p>
                </div>
                {/* 🔗 Botão "Ver perfil" usando o componente Link do Next.js para navegação otimizada */}
                <Link
                  href={`/usuarios/${usuario.id}`} // 🎯 Aponta para a rota dinâmica do perfil do usuário com o 'id' correto
                  className="mt-4 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                  {/* Texto do botão */}
                  <span className="mr-2">Ver perfil</span>
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
