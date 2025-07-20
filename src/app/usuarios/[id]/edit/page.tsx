"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { userSchema, ApiUser } from "@/app/usuarios/utils/userValidation"; // 📚 Importa o schema de validação e o tipo 'ApiUser'
import { z } from "zod";
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

// 📝 Schema para edição de usuário (senha é opcional para atualização)
const userEditSchema = userSchema.partial({ senha: true });
type UserEditFormData = z.infer<typeof userEditSchema>;

const UserEditPage: React.FC = () => {
  // 🧭 Extrai o 'id' do usuário da URL e a instância do router para navegação
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // 📊 Estados para gerenciar o carregamento, erros e mensagens de sucesso
  const [loadingUser, setLoadingUser] = useState(true); // ⏳ Indica se os dados do usuário estão sendo carregados
  const [fetchingError, setFetchingError] = useState<string | null>(null); // ❌ Armazena erros ao buscar o usuário
  const [submittingError, setSubmittingError] = useState<string | null>(null); // ❌ Armazena erros ao submeter o formulário
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // ✅ Controla a visibilidade da mensagem de sucesso

  // 📦 Configura o React Hook Form com o resolver Zod para validação
  const {
    register, // Função para registrar inputs do formulário
    handleSubmit, // Para lidar com a submissão do formulário
    formState: { errors, isSubmitting }, // Estado do formulário (erros, se está submetendo)
    reset, // Função para resetar/preencher o formulário com valores padrão ou dados existentes
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema), // Aplica o schema de validação Zod
  });

  // 🚀 Efeito colateral para buscar os dados do usuário existente ao carregar a página
  useEffect(() => {
    // 🛡️ Se não houver userId, para o carregamento e retorna
    if (!userId) {
      setLoadingUser(false);
      return;
    }

    // 📨 Função assíncrona para buscar o usuário na API
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        setFetchingError(null);
        // 🎯 Faz uma requisição GET para o endpoint da API: /users/:id
        const response = await api.data.get<ApiUser>(`/users/${userId}`);
        // 🔄 Preenche o formulário com os dados do usuário recebidos da API
        reset({
          nome: response.data.nome,
          email: response.data.email,
          tipo_usuario: response.data.tipo_usuario,
        });
      } catch (err: unknown) {
        // ❌ Trata erros de requisição Axios
        if (axios.isAxiosError(err)) {
          const errorMessage =
            err.response?.data && Object.keys(err.response.data).length === 0
              ? `Erro interno do servidor (${
                  err.response.status || "desconhecido"
                }).`
              : err.response?.data?.message || err.message;
          console.error(
            "Erro ao buscar dados do usuário para edição:",
            errorMessage,
            err
          );
          setFetchingError(
            "Falha ao carregar dados do usuário para edição: " +
              errorMessage +
              " 😥"
          );
        } else if (err instanceof Error) {
          // ❌ Trata outros tipos de erros JavaScript
          console.error(
            "Erro desconhecido ao buscar dados do usuário para edição:",
            err.message
          );
          setFetchingError(
            "Ocorreu um erro inesperado ao carregar dados do usuário. 😥"
          );
        } else {
          // ❌ Trata erros não identificados
          console.error(
            "Erro não identificado ao buscar dados do usuário para edição."
          );
          setFetchingError(
            "Ocorreu um erro desconhecido. Por favor, tente atualizar a página. 😥"
          );
        }
      } finally {
        setLoadingUser(false); // Finaliza o carregamento, independente do resultado
      }
    };

    fetchUser(); // Chama a função para buscar o usuário
  }, [userId, reset]);

  // 📨 Função assíncrona para lidar com o envio do formulário de edição
  const onSubmit = async (data: UserEditFormData) => {
    try {
      setSubmittingError(null);
      setShowSuccessMessage(false); // Esconde a mensagem de sucesso antes de uma nova submissão
      // 🎯 Faz uma requisição PUT para atualizar o usuário por ID
      // Cria um objeto com os dados a serem atualizados, incluindo a senha apenas se ela foi preenchida
      const updateData = {
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario,
        ...(data.senha && { senha: data.senha }), // adiciona a senha
      };

      const response = await api.data.put(`/users/${userId}`, updateData);
      console.log("Usuário atualizado com sucesso:", response.data);
      setShowSuccessMessage(true); // ✅ Exibe a mensagem de sucesso
      setTimeout(() => {
        router.push(`/usuarios/${userId}`);
      }, 2000);
    } catch (err: unknown) {
      // ❌ Trata erros de requisição Axios durante a submissão
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data && Object.keys(err.response.data).length === 0
            ? `Erro interno do servidor (${
                err.response.status || "desconhecido"
              }).`
            : err.response?.data?.message || err.message;
        console.error("Erro ao atualizar usuário:", errorMessage, err);
        setSubmittingError(
          "Erro ao atualizar usuário: " + errorMessage + " 😔"
        );
      } else if (err instanceof Error) {
        // ❌ Trata outros tipos de erros JavaScript
        console.error("Erro desconhecido ao atualizar usuário:", err.message);
        setSubmittingError(
          "Ocorreu um erro inesperado ao atualizar usuário. 😔"
        );
      } else {
        // ❌ Trata erros não identificados
        console.error("Erro não identificado ao atualizar usuário.");
        setSubmittingError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  // ⏳ Renderiza um indicador de carregamento enquanto os dados do usuário estão sendo buscados
  if (loadingUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">
          Carregando dados do usuário...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  // ❌ Renderiza uma mensagem de erro se a busca inicial falhar
  if (fetchingError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto max-w-md text-center border border-red-200">
          <p className="text-2xl text-red-700 font-bold mb-4">
            Ops! Algo deu errado.
          </p>
          <p className="text-lg text-gray-700 mb-6">{fetchingError}</p>
          <button
            onClick={() => router.back()} // Volta para a página anterior
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            Voltar
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  // 📝 Renderização do formulário de edição do perfil
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)} // Associa a função onSubmit ao evento de submissão do formulário
        className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800">
          Editar Perfil de Usuário ✏️
        </h2>

        {submittingError && ( // Exibe mensagem de erro de submissão, se houver
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-md"
            role="alert"
          >
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {submittingError}</span>
          </div>
        )}

        {showSuccessMessage && ( // Exibe mensagem de sucesso após a atualização
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 shadow-md"
            role="alert"
          >
            <strong className="font-bold">Sucesso!</strong>
            <span className="block sm:inline">
              {" "}
              Usuário atualizado com sucesso! 🎉
            </span>
          </div>
        )}

        {/* Campo de Nome */}
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
            {...register("nome")} // Registra o input no React Hook Form
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          />
          {errors.nome && ( // Exibe erro de validação para o campo nome
            <p className="text-red-600 text-xs italic mt-2">
              {errors.nome.message} 🚫
            </p>
          )}
        </div>

        {/* Campo de E-mail */}
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
            {...register("email")} // Registra o input no React Hook Form
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          />
          {errors.email && ( // Exibe erro de validação para o campo email
            <p className="text-red-600 text-xs italic mt-2">
              {errors.email.message} 🚫
            </p>
          )}
        </div>

        {/* Campo de Nova Senha (Opcional) */}
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
            {...register("senha")} // Registra o input no React Hook Form
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Deixe em branco para manter a senha atual"
          />
          {errors.senha && ( // Exibe erro de validação para o campo senha
            <p className="text-red-600 text-xs italic mt-2">
              {errors.senha.message} 🚫
            </p>
          )}
        </div>

        {/* Campo de Tipo de Usuário (Select) */}
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
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          >
            <option value="">Selecione um tipo</option>
            <option value="doador">Doador</option>
            <option value="receptor">Receptor</option>
          </select>
          {errors.tipo_usuario && ( // Exibe erro de validação para o campo tipo_usuario
            <p className="text-red-600 text-xs italic mt-2">
              {errors.tipo_usuario.message} 🚫
            </p>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting} // Desabilita o botão enquanto o formulário está sendo submetido
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-60 transition-all duration-300"
          >
            {isSubmitting ? "Salvando... ⏳" : "Salvar Alterações ✅"}
          </button>
          <button
            type="button"
            onClick={() => router.back()} // Redireciona para a página anterior ao cancelar
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-300"
          >
            Cancelar ↩️
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
