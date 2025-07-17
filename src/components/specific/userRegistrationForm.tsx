// src/components/specific/userRegistrationForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 🎯 Importa o schema e tipo do NOVO arquivo userValidation.ts
import { userSchema, UserFormData } from "@/app/usuarios/utils/userValidation";

// 🔗 Importa a instância configurada do Axios
// Opção A: Usando o caminho absoluto com alias (MELHOR PRÁTICA E MAIS ROBUSTO)
import api from "@/axios"; // Se o axios está em src/components/ui/api.ts

// Opção B: Se o 'axios.ts' estiver na raiz do projeto (não recomendado, mas possível)
// import api from "../../axios"; // Se o axios.ts estiver na raiz do projeto (e não na pasta ui)

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
      const response = await api.post("/users", data); // Endpoint /users
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
