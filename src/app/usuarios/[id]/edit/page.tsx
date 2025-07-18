"use client"; // 🧑‍💻 Indica que este é um Client Component

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // 🧭 Hooks para pegar parâmetros da URL e para navegação
import { useForm } from "react-hook-form"; // 🎣 Importa o hook 'useForm'
import { zodResolver } from "@hookform/resolvers/zod"; // 🤝 Importa o resolvedor para Zod
import api from "@/lib/api"; // 🔗 Importa a instância configurada do Axios
import { userSchema, ApiUser } from "@/app/usuarios/utils/userValidation"; // 📚 Importa o schema e tipo para os dados do formulário de usuário
import { z } from "zod"; // Importa Zod para criar um schema de edição
import axios, { AxiosError } from "axios"; // 📦 Importa Axios e AxiosError para tipagem segura

// 📝 Schema para edição de usuário (senha é opcional)
const userEditSchema = userSchema.partial({ senha: true }); // Torna a senha opcional para edição
type UserEditFormData = z.infer<typeof userEditSchema>;

const UserEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter(); // 🧭 Instância do router para redirecionamento
  const userId = params.id as string; // Pega o ID do usuário da URL

  const [loadingUser, setLoadingUser] = useState(true); // ⏳ Estado para carregamento inicial do usuário
  const [fetchingError, setFetchingError] = useState<string | null>(null); // ❌ Erro ao buscar usuário
  const [submittingError, setSubmittingError] = useState<string | null>(null); // ❌ Erro ao submeter formulário

  // 📦 Configura o React Hook Form com o resolver Zod para validação
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // 🔄 Função para resetar/preencher o formulário
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema), // Usa o schema de edição
  });

  // 🚀 Efeito para buscar os dados do usuário existente ao carregar a página
  useEffect(() => {
    if (!userId) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        setFetchingError(null);
        // 🎯 Faz uma requisição GET para buscar o usuário por ID
        const response = await api.data.get<ApiUser>(`/users/${userId}`);
        // 🔄 Preenche o formulário com os dados do usuário
        reset({
          nome: response.data.nome,
          email: response.data.email,
          tipo_usuario: response.data.tipo_usuario,
          // Senha não é preenchida por segurança
        });
      } catch (err: unknown) {
        // 🎯 CORREÇÃO: Usando 'unknown' em vez de 'any'
        if (axios.isAxiosError(err)) {
          console.error(
            "Erro ao buscar dados do usuário para edição:",
            err.response?.data || err.message
          );
          setFetchingError(
            "Falha ao carregar dados do usuário para edição. 😥"
          );
        } else if (err instanceof Error) {
          console.error(
            "Erro desconhecido ao buscar dados do usuário para edição:",
            err.message
          );
          setFetchingError(
            "Ocorreu um erro inesperado ao carregar dados do usuário. 😥"
          );
        } else {
          console.error(
            "Erro não identificado ao buscar dados do usuário para edição."
          );
          setFetchingError("Ocorreu um erro desconhecido. 😥");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId, reset]); // Re-executa se o userId mudar ou se 'reset' for atualizado

  // 📨 Função assíncrona para lidar com o envio do formulário de edição
  const onSubmit = async (data: UserEditFormData) => {
    try {
      setSubmittingError(null);
      // 🎯 Faz uma requisição PUT para atualizar o usuário por ID
      // Envia apenas os campos que podem ser atualizados
      const updateData = {
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario,
        // Inclua a senha apenas se ela foi preenchida no formulário
        ...(data.senha && { senha: data.senha }),
      };

      const response = await api.data.put(`/users/${userId}`, updateData);
      console.log("Usuário atualizado com sucesso:", response.data);
      alert("Usuário atualizado com sucesso! 🎉");
      router.push(`/usuarios/${userId}`); // 🧭 Redireciona de volta para a página de perfil
    } catch (err: unknown) {
      // 🎯 CORREÇÃO: Usando 'unknown' em vez de 'any'
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao atualizar usuário:",
          err.response?.data || err.message
        );
        setSubmittingError(
          "Erro ao atualizar usuário: " +
            (err.response?.data?.message ||
              "Verifique o console para mais detalhes. 😔")
        );
      } else if (err instanceof Error) {
        console.error("Erro desconhecido ao atualizar usuário:", err.message);
        setSubmittingError(
          "Ocorreu um erro inesperado ao atualizar usuário. 😔"
        );
      } else {
        console.error("Erro não identificado ao atualizar usuário.");
        setSubmittingError("Ocorreu um erro desconhecido. 😔");
      }
    }
  };

  // ⏳ Renderiza indicadores de carregamento ou erro
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

  // 📝 Renderização do formulário de edição
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          {" "}
          {/* 🎨 Cor ajustada para garantir visibilidade */}
          Editar Perfil de Usuário ✏️
        </h2>

        {submittingError && ( // Exibe erro de submissão
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Atenção!</strong>
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
            onClick={() => router.push(`/usuarios/${userId}`)} // Botão para cancelar e voltar
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
