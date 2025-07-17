"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// 🎯 CORREÇÃO AQUI: Importa do caminho correto e usa a propriedade 'data'
import api from "@/lib/api";
import { ApiUser } from "@/app/usuarios/utils/userValidation";

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);
        // 🎯 CORREÇÃO AQUI: Usando api.data.get
        const response = await api.data.get("/users");
        setUsuarios(response.data);
      } catch (err: any) {
        console.error(
          "Erro ao buscar usuários:",
          err.response?.data || err.message
        );
        setError(
          "Falha ao carregar os usuários. Verifique a conexão com a API. 😔"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

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

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-reuse-blue">
        Lista de Usuários ReUSE 🧑‍🤝‍🧑
      </h1>
      {usuarios.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          Nenhum usuário encontrado. Crie um! 🚀
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition duration-300 ease-in-out flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
                  {usuario.nome}
                </h2>
                <p className="text-gray-600 text-base mb-1">
                  Email:{" "}
                  <span className="font-medium text-blue-700">
                    {usuario.email}
                  </span>
                </p>
                <p className="text-gray-600 text-base mb-1">
                  Tipo:{" "}
                  <span className="font-medium text-purple-700 capitalize">
                    {usuario.tipo_usuario}
                  </span>
                </p>
              </div>
              <Link
                href={`/usuarios/${usuario.id}`}
                className="mt-4 inline-block bg-reuse-blue hover:bg-blue-700 text-white py-2 px-4 rounded-full self-end transition duration-300 transform hover:scale-105"
              >
                Ver perfil ➡️
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
