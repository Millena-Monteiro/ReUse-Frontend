"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 🎯 CORREÇÃO AQUI: Importa do caminho correto e usa a propriedade 'data'
import api from "@/lib/api"; // Caminho atualizado

import {
  userSchema,
  UserFormData,
  ApiUser,
} from "@/app/usuarios/utils/userValidation";
import { z } from "zod";

const userEditSchema = userSchema.partial({ senha: true });
type UserEditFormData = z.infer<typeof userEditSchema>;

const UserEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loadingUser, setLoadingUser] = useState(true);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    if (!userId) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        setFetchingError(null);
        // 🎯 CORREÇÃO AQUI: Usando api.data.get
        const response = await api.data.get<ApiUser>(`/users/${userId}`);
        reset({
          nome: response.data.nome,
          email: response.data.email,
          tipo_usuario: response.data.tipo_usuario,
        });
      } catch (err: any) {
        console.error("Erro ao buscar dados do usuário para edição:", err);
        setFetchingError("Falha ao carregar dados do usuário para edição. 😥");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (data: UserEditFormData) => {
    try {
      setSubmittingError(null);
      const updateData = {
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario,
        ...(data.senha && { senha: data.senha }),
      };

      // 🎯 CORREÇÃO AQUI: Usando api.data.put
      const response = await api.data.put(`/users/${userId}`, updateData);
      console.log("Usuário atualizado com sucesso:", response.data);
      alert("Usuário atualizado com sucesso! 🎉");
      router.push(`/usuarios/${userId}`);
    } catch (error: any) {
      console.error(
        "Erro ao atualizar usuário:",
        error.response?.data || error.message
      );
      setSubmittingError(
        "Erro ao atualizar usuário: " +
          (error.response?.data?.message ||
            "Verifique o console para mais detalhes. 😔")
      );
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-700">
        Carregando dados do usuário... ⏳
      </div>
    );
  }

  if (fetchingError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg font-semibold">
        {fetchingError} 💔
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Editar Perfil de Usuário ✏️
        </h2>

        {submittingError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {submittingError}</span>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="nome"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            {...register("nome")}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
          />
          {errors.nome && (
            <p className="text-red-600 text-xs italic mt-2">
              {errors.nome.message} 🚫
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
          />
          {errors.email && (
            <p className="text-red-600 text-xs italic mt-2">
              {errors.email.message} 🚫
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="senha"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Nova Senha (opcional):
          </label>
          <input
            type="password"
            id="senha"
            {...register("senha")}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
            placeholder="Deixe em branco para manter a senha atual"
          />
          {errors.senha && (
            <p className="text-red-600 text-xs italic mt-2">
              {errors.senha.message} 🚫
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="tipo_usuario"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Tipo de Usuário: 👤
          </label>
          <select
            id="tipo_usuario"
            {...register("tipo_usuario")}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
          >
            <option value="">Selecione um tipo</option>
            <option value="doador">Doador</option>
            <option value="receptor">Receptor</option>
          </select>
          {errors.tipo_usuario && (
            <p className="text-red-600 text-xs italic mt-2">
              {errors.tipo_usuario.message} 🚫
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-reuse-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-4 focus:ring-reuse-green focus:ring-opacity-50 disabled:opacity-60 transition duration-300 transform hover:scale-105"
          >
            {isSubmitting ? "Salvando... ⏳" : "Salvar Alterações ✅"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/usuarios/${userId}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
          >
            Cancelar ↩️
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
