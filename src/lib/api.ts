// 🌐 Configuração das instâncias do Axios para comunicação com a API de backend.

import axios from "axios"; // 📦 Importa a biblioteca Axios.

// 🔗 Instância para operações de DADOS (usuários, itens, etc.)
const dataApi = axios.create({
  baseURL: "https://reuse-lwju.onrender.com", // 🎯 URL BASE DA API DE BACKEND.
  timeout: 10000, // ⏱️ Tempo máximo de espera para uma resposta da API (10 segundos).
  headers: {
    "Content-Type": "application/json", // 📝 Define o tipo de conteúdo padrão para JSON.
  },
});

// 🔗 Instância para operações de AUTENTICAÇÃO
const authApi = axios.create({
  baseURL: "https://reuse-lwju.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Exemplo: 'Authorization': 'Bearer YOUR_AUTH_TOKEN' (seria adicionado dinamicamente)
  },
});

// 📤 Exporta um objeto nomeado contendo ambas as instâncias.
const apiInstances = {
  data: dataApi,
  auth: authApi,
};

export default apiInstances; // 📤 Exporta a instância configurada do Axios para ser usada em outras partes do aplicativo.
