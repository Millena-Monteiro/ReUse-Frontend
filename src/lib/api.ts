// 🌐 Configuração das instâncias do Axios para comunicação com a API de backend.

import axios from "axios"; // 📦 Importa a biblioteca Axios.

// 🔗 Instância para operações de DADOS (usuários, itens, etc.)
const dataApi = axios.create({
  baseURL: "https://reuse-lwju.onrender.com", // 🎯 URL BASE DA API DE BACKEND.
  timeout: 30000, // ⏱️ Tempo máximo de espera para uma resposta da API (30 segundos).
  headers: {
    "Content-Type": "application/json", // 📝 Define o tipo de conteúdo padrão para JSON.
  },
});

// 🔗 Instância para operações de AUTENTICAÇÃO
const authApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "https://reuse-lwju.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 📤 Exporta um objeto nomeado contendo ambas as instâncias.
const apiInstances = {
  data: dataApi,
  auth: authApi,
};

export default apiInstances;
