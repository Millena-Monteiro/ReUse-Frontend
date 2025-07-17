'use client'; // ESSENCIAL: Torna este um Componente de Cliente

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../contexts/SessionContext'; 
import api from '@/lib/api';                          

export default function LoginPage() {
  const [email, setEmail] = useState('teste@email.com');
  const [password, setPassword] = useState('senha123');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setUser } = useSession();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // CORREÇÃO PRINCIPAL:
      // 1. Usando 'api.auth' para direcionar para a API interna.
      // 2. Usando a URL '/users/login' que corresponde à sua estrutura de pastas.
      const response = await api.auth.post('/users/login', { email, password });

      if (response.status === 200) {
        setUser(response.data);
        alert('Login realizado com sucesso!');
        router.push('/');
      }
    } catch (err: any) {
      // Log do erro completo no console para facilitar a depuração
      console.error('Falha no login:', err);
      
      // Mensagem de erro para o usuário
      setError(err.response?.data?.message || 'Email ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-800">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}