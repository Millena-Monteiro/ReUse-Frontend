// src/app/usuarios/page.tsx
"use client"; // 🧑‍💻 Indica que este é um Client Component, pois usa hooks do React e do Next.js

import React, { useState, useEffect } from "react"; // 🎣 Importa hooks essenciais do React (useState, useEffect)
import Link from "next/link"; // 🔗 Componente do Next.js para navegação entre páginas
import api from "@/axios"; // 🌐 Importa a sua instância configurada do Axios (para fazer requisições à API)
import { ApiUser } from "@/app/usuarios/utils/userValidation"; // 📚 Importa o tipo 'ApiUser' do seu schema de validação para tipagem segura

const UsuariosPage: React.FC = () => {
  // 📊 Estados para gerenciar os dados dos usuários, carregamento e erros
  const [usuarios, setUsuarios] = useState<ApiUser[]>([]); // 📦 Array para armazenar os usuários buscados
  const [loading, setLoading] = useState<boolean>(true); // ⏳ Estado para indicar se os dados estão sendo carregados
  const [error, setError] = useState<string | null>(null); // ❌ Estado para armazenar mensagens de erro, se houver

  console.log("Componente UsuariosPage renderizado."); // 💡 Log 1: Quando o componente é renderizado/re-renderizado

  // 🚀 Efeito colateral para buscar os usuários da API quando o componente é montado
  useEffect(() => {
    console.log("useEffect disparado."); // 💡 Log 2: Quando o useEffect é ativado

    // 📨 Função assíncrona para buscar a lista de usuários
    const fetchUsuarios = async () => {
      console.log("Função fetchUsuarios iniciada."); // 💡 Log 3: Quando a função de busca começa
      try {
        setLoading(true); // Inicia o estado de carregamento
        setError(null); // Limpa qualquer erro anterior
        console.log("Tentando fazer requisição GET para /users..."); // 💡 Log 4: Antes da chamada da API

        // 🎯 Faz uma requisição GET para o endpoint '/users' da API (conforme seu backend)
        const response = await api.get("/users");
        console.log(
          "Requisição GET /users bem-sucedida. Resposta:",
          response.data
        ); // 💡 Log 5: Se a requisição for bem-sucedida
        setUsuarios(response.data); // ✅ Atualiza o estado com os dados recebidos da API
      } catch (err: any) {
        // 🚨 Em caso de erro, loga e define a mensagem de erro para exibição
        console.error(
          "Erro ao buscar usuários (catch block):",
          err.response?.data || err.message,
          err
        ); // 💡 Log 6: Se a requisição falhar
        setError(
          "Falha ao carregar os usuários. Verifique a conexão com a API. 😔"
        );
      } finally {
        setLoading(false); // 🏁 Finaliza o carregamento, independentemente do sucesso ou falha
        console.log("Função fetchUsuarios finalizada. Loading:", false); // 💡 Log 7: Após a finalização da busca
      }
    };

    fetchUsuarios(); // 🏃 Chama a função de busca ao montar o componente
  }, []); // 📌 O array vazio [] garante que este useEffect rode APENAS uma vez, na montagem inicial.

  console.log("Estado de carregamento:", loading, "Estado de erro:", error); // 💡 Log 8: Estado atual antes da renderização condicional

  // 🔄 Renderização condicional baseada nos estados de carregamento e erro
  if (loading) {
    console.log("Renderizando estado de carregamento..."); // 💡 Log 9: Se estiver carregando
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-700">
        Carregando usuários... ⏳
      </div>
    );
  }

  if (error) {
    console.log("Renderizando estado de erro:", error); // 💡 Log 10: Se houver erro
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        {error} 💔
      </div>
    );
  }

  console.log("Renderizando lista de usuários. Total:", usuarios.length); // 💡 Log 11: Se os dados foram carregados

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
                // 🔑 AQUI: Use 'usuario.id' para a chave, pois sua API retorna 'id'
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
