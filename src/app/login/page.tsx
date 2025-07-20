"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const loginSchema = z.object({
  email: z.email("E-mail inválido. 📧"),
  senha: z.string().min(1, "A senha é obrigatória. 🔑"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.auth.post("auth/login", {
        email: data.email,
        senha: data.senha,
      });

      console.log("Login bem-sucedido:", response.data);
      alert("Login realizado com sucesso! 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.message || "Erro desconhecido no servidor.";
        console.error("Erro no login:", serverMessage);
        setError("email", {
          type: "server",
          message: serverMessage,
        });
        setError("senha", {
          type: "server",
          message: serverMessage,
        });
      } else if (err instanceof Error) {
        console.error("Erro inesperado:", err.message);
        setError("email", {
          type: "unknown",
          message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        });
      } else {
        console.error("Erro não identificado no login.");
        setError("email", {
          type: "unknown",
          message: "Ocorreu um erro desconhecido. Por favor, tente novamente.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-100"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-reuse-blue">
          Login no ReUSE 🔑
        </h2>

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

        <div className="mb-8">
          <label
            htmlFor="senha"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
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
            className="bg-reuse-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-4 focus:ring-reuse-blue focus:ring-opacity-50 disabled:opacity-60 transition duration-300 transform hover:scale-105"
          >
            {isSubmitting ? "Entrando... ⏳" : "Entrar ➡️"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
