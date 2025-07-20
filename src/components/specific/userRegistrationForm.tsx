"use client"; // 🧑‍💻 Indica que este é um Client Component, pois usa hooks do React e do Next.js

import React from "react";
import { useForm } from "react-hook-form"; // 🎣 Importa o hook 'useForm' do React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"; // 🤝 Importa o resolvedor para integrar Zod com React Hook Form
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

// 📚 Importa o schema e tipo para os dados do formulário de usuário do seu arquivo de validação.
import { userSchema, UserFormData } from "@/app/usuarios/utils/userValidation";

// 🔗 Importa a instância configurada do Axios para requisições à API.
import api from "@/lib/api";

const UserRegistrationForm: React.FC = () => {
  // 📦 Configura o React Hook Form com o resolver Zod para validação.
  const {
    register, // ✍️ Função para registrar os campos do input HTML/JSX.
    handleSubmit, // 🚀 Função que lida com o envio do formulário, executando a validação antes.
    formState: { errors, isSubmitting }, // 📊 Objeto que contém o estado do formulário (erros de validação, estado de envio).
    reset, // 🔄 Função para resetar o formulário para seus valores iniciais ou para um estado vazio.
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema), // Conecta o Zod para validação dos inputs do formulário.
  });

  // 📨 Função assíncrona que é chamada ao enviar o formulário, após a validação bem-sucedida.
  const onSubmit = async (data: UserFormData) => {
    try {
      // 🎯 Faz uma requisição POST para o endpoint '/users' da API com os dados do formulário.
      const response = await api.data.post("/users", data); // 🎯 Usando api.data
      console.log("Usuário cadastrado com sucesso:", response.data); // 🎉 Log de sucesso no console do navegador.
      alert("Usuário cadastrado com sucesso! 🎉"); // 🥳 Alerta de sucesso para o usuário.
      reset(); // ✨ Limpa o formulário após o envio bem-sucedido.
    } catch (err: unknown) {
      // 🎯 CORREÇÃO: Tipando o erro como 'unknown'
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao cadastrar usuário:",
          err.response?.data || err.message
        );
        alert(
          "Erro ao cadastrar usuário: " +
            (err.response?.data?.message ||
              "Verifique o console para mais detalhes. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao cadastrar usuário:", err.message);
        alert("Ocorreu um erro inesperado ao cadastrar usuário. 😔");
      } else {
        console.error("Erro não identificado ao cadastrar usuário.");
        alert("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  // 📝 Renderização do formulário
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {" "}
      {/* 🖼️ Envolve o formulário para centralizar e dar um fundo */}
      <form
        onSubmit={handleSubmit(onSubmit)} // Conecta a função de envio do formulário.
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        {" "}
        {/* 💅 Estilo do formulário */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-reuse-blue">
          {" "}
          {/* ✍️ Título do formulário estilizado */}
          Cadastre-se no ReUSE 🚀
        </h2>
        {/* Campo Nome */}
        <div className="mb-6">
          {" "}
          {/* 📦 Grupo de input com margem inferior */}
          <label
            htmlFor="nome"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Nome: ✨
          </label>
          <input
            type="text"
            id="nome"
            {...register("nome")} // 🎣 Conecta o input ao React Hook Form
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200" // 🎨 Estilos do input com Tailwind
          />
          {errors.nome && (
            <p className="text-red-600 text-xs italic mt-2">
              {errors.nome.message} 🚫
            </p>
          )}{" "}
          {/* ❌ Exibe mensagem de erro se houver */}
        </div>
        {/* Campo E-mail */}
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
        {/* Campo Senha */}
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
        {/* Campo Tipo de Usuário (Novo) */}
        <div className="mb-6">
          <label
            htmlFor="tipo_usuario"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Tipo de Usuário: 👤
          </label>
          <select
            id="tipo_usuario"
            {...register("tipo_usuario")} // Registra o campo select com o nome "tipo_usuario"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-reuse-blue focus:border-transparent transition duration-200"
          >
            <option value="">Selecione um tipo</option>{" "}
            {/* Opção padrão vazia */}
            <option value="doador">Doador</option>
            <option value="receptor">Receptor</option>
          </select>
          {errors.tipo_usuario && ( // Exibe mensagem de erro se houver erro de validação para 'tipo_usuario'
            <p className="text-red-600 text-xs italic mt-2">
              {errors.tipo_usuario.message} 🚫
            </p>
          )}
        </div>
        {/* Botão de Envio */}
        <div className="flex items-center justify-center">
          {" "}
          {/* 💯 Centraliza o botão. */}
          <button
            type="submit"
            disabled={isSubmitting} // 🚫 Desabilita o botão enquanto o formulário está sendo enviado.
            className="bg-reuse-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-4 focus:ring-reuse-green focus:ring-opacity-50 disabled:opacity-60 transition duration-300 transform hover:scale-105" // 🎨 Estilo do botão com cores personalizadas, padding, bordas arredondadas, foco e transição.
          >
            {isSubmitting ? "Cadastrando... ⏳" : "Cadastrar Usuário 🧑‍💻"}{" "}
            {/* ⏱️ Texto do botão muda durante o envio para indicar o estado. */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
