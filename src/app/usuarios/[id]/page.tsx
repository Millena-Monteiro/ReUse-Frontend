"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
// 🎯 CORREÇÃO AQUI: Importa do caminho correto e usa a propriedade 'data'
import api from "@/lib/api";
import { ApiUser } from "@/app/usuarios/utils/userValidation";

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        // 🎯 CORREÇÃO AQUI: Usando api.data.get
        const response = await api.data.get<ApiUser>(`/users/${userId}`);
        setUser(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar perfil do usuário:", err);
        setError("Falha ao carregar o perfil do usuário. 😥");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Usuário não encontrado ou não existe. 🤷‍♀️
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Perfil de {user.nome} ✨
        </h1>
        <div className="space-y-4">
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
            {user.tipo_usuario}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href={`/usuarios/${user.id}/edit`}
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
