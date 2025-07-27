'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSessionContext } from '../contexts/SessionContext'; 
import api from '@/lib/api';
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";                          

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .email("Formato de e-mail inválido.")
    .min(1, "O e-mail é obrigatório."),
  senha: z.string().min(1, "A senha é obrigatória. 🔑"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useSessionContext();

  // 💡 Estados para feedback visual
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💡 Configuração do react-hook-form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "teste@email.com",
      senha: "senha123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setGlobalError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await api.auth.post('/users/login', {
        email: data.email,
        password: data.senha,
      });

      if (response.status === 200) {
        setUser(response.data);
        setSuccessMessage("Login realizado com sucesso! 😉 Redirecionando...");
        reset();
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message || 'Erro desconhecido no servidor.';
        console.error('Falha no login:', serverMessage, err.response?.data);
        setGlobalError(`Falha no login: ${serverMessage}`);
      } else if (err instanceof Error) {
        console.error('Erro inesperado:', err.message);
        setGlobalError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      } else {
        console.error('Erro não identificado no login.');
        setGlobalError('Ocorreu um erro desconhecido. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white text-gray-800 shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-reuse-blue">
          Login
        </h2>

        {/* 💡 Mensagens de feedback */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {globalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro!</strong>{" "}
            <span className="block sm:inline">{globalError}</span>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
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

        <div className="mb-8">
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha:
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
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75 flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Entrando... ⏳" : "Entrar"}
          </button>
        </div>

        {/* 💡 Opção Cadastre-se */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-reuse-blue hover:underline font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
