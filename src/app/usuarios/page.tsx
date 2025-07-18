"use client"; // 🧑‍💻 Indica que este é um Client Component, pois usa hooks do React e do Next.js

import React, { useState, useEffect } from "react"; // 🎣 Importa hooks essenciais do React (useState, useEffect)
import Link from "next/link"; // 🔗 Componente do Next.js para navegação entre páginas
import api from "@/lib/api"; // 🌐 Importa a sua instância configurada do Axios (CORRIGIDO O CAMINHO)
import { ApiUser } from "@/app/usuarios/utils/userValidation"; // 📚 Importa o tipo 'ApiUser' do seu schema de validação para tipagem segura
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

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
        const response = await api.data.get("/users"); // 🎯 Usando api.data
        setUsuarios(response.data); // ✅ Atualiza o estado com os dados recebidos da API
      } catch (err: unknown) {
        // 🎯 CORREÇÃO: Usando 'unknown' em vez de 'any'
        if (axios.isAxiosError(err)) {
          console.error(
            "Erro ao buscar usuários:",
            err.response?.data || err.message
          );
          setError(
            "Falha ao carregar os usuários. Verifique a conexão com a API. 😔"
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
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-700">
        Carregando usuários... ⏳
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        {error} 💔
      </div>
    );
  }

  // 📄 Renderização da lista de usuários
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      {" "}
      {/* 📏 Container responsivo centralizado com padding */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-reuse-blue">
        {" "}
        {/* 🎨 Título com cor e tamanho customizados do Tailwind */}
        Lista de Usuários ReUSE 🧑‍🤝‍🧑
      </h1>
      {usuarios.length === 0 ? ( // 🤷‍♀️ Verifica se não há usuários
        <p className="text-center text-gray-600 text-lg mt-10">
          Nenhum usuário encontrado. Crie um! 🚀
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {/* 📐 Grid responsivo para organizar os cards */}
          {usuarios.map(
            (
              usuario // 🗺️ Mapeia cada usuário para um card
            ) => (
              <div
                key={usuario.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition duration-300 ease-in-out flex flex-col justify-between" // 🃏 Estilo do card do usuário
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
                    {usuario.nome}
                  </h2>{" "}
                  {/* 🏷️ Nome do usuário (trunca se for muito longo) */}
                  <p className="text-gray-600 text-base mb-1">
                    Email:{" "}
                    <span className="font-medium text-blue-700">
                      {usuario.email}
                    </span>
                  </p>{" "}
                  {/* ✉️ Email do usuário */}
                  {/* 👤 Tipo de Usuário */}
                  <p className="text-gray-600 text-base mb-1">
                    Tipo:{" "}
                    <span className="font-medium text-purple-700 capitalize">
                      {usuario.tipo_usuario}
                    </span>
                  </p>
                  {/* Removido createdAt por não estar no JSON que você forneceu. Adicione de volta se a API retornar. */}
                </div>
                {/* 🔗 Botão "Ver perfil" usando o componente Link do Next.js para navegação dinâmica */}
                {/* AQUI: Use 'usuario.id' no href, pois sua API retorna 'id' */}
                <Link
                  href={`/usuarios/${usuario.id}`} // 🎯 Aponta para a rota dinâmica do perfil do usuário com o 'id' correto
                  className="mt-4 inline-block bg-reuse-blue hover:bg-blue-700 text-white py-2 px-4 rounded-full self-end transition duration-300 transform hover:scale-105"
                >
                  Ver perfil ➡️
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
