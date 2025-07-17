"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserFormData } from "@/app/usuarios/utils/userValidation";

// 🎯 CORREÇÃO AQUI: Importa do caminho correto e usa a propriedade 'data'
import api from "@/lib/api";

const UserRegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // 🎯 CORREÇÃO AQUI: Usando api.data.post
      const response = await api.data.post("/users", data);
      console.log("Usuário cadastrado com sucesso:", response.data);
      alert("Usuário cadastrado com sucesso! 🎉");
      reset();
    } catch (error: any) {
      console.error(
        "Erro ao cadastrar usuário:",
        error.response?.data || error.message
      );
      alert(
        "Erro ao cadastrar usuário: " +
          (error.response?.data?.message ||
            "Verifique o console para mais detalhes. 😔")
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-reuse-blue">
          Cadastre-se no ReUSE 🚀
        </h2>

        <div className="mb-6">
          <label
            htmlFor="nome"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Nome: ✨
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
            E-mail: 📧
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

        <div className="mb-8">
          <label
            htmlFor="senha"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Senha: 🔒
          </label>
          <input
            type="password"
            id="senha"
            {...register("senha")}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
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

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-reuse-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-4 focus:ring-reuse-green focus:ring-opacity-50 disabled:opacity-60 transition duration-300 transform hover:scale-105"
          >
            {isSubmitting ? "Cadastrando... ⏳" : "Cadastrar Usuário 🧑‍💻"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
