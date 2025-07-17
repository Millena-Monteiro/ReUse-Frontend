// src/app/usuarios/utils/userValidation.ts
import { z } from "zod"; // 🚀 Importa a biblioteca Zod para validação

// 📝 Schema para criar/atualizar um usuário via formulário (com senha)
// Define a estrutura e as regras de validação para os dados que o usuário vai enviar.
export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres. 😟"), // Nome é string e tem mínimo de 3 caracteres
  email: z.string().email("E-mail inválido. 📧"), // Email deve ser um formato de email válido
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres. 🔑"), // Senha é string e tem mínimo de 6 caracteres
  tipo_usuario: z.string().optional(), // 🆕 Adicionado: 'tipo_usuario' é opcional para o formulário de cadastro/edição
});

// 💡 Tipo inferido do schema, super útil para tipagem no React Hook Form e requisições Axios.
export type UserFormData = z.infer<typeof userSchema>;

// 📥 Schema para um usuário que vem diretamente da API
// Estende o 'userSchema' com campos adicionais que a API pode retornar, como IDs e timestamps.
export const apiUserSchema = z.object({
  // 🚨 ATENÇÃO: Recriado para garantir que 'id' e 'tipo_usuario' estejam presentes
  id: z.string(), // 🎯 CORRIGIDO: Agora é 'id' (minúsculo, sem underscore) para corresponder à sua API
  nome: z.string(), // Nome é string
  email: z.string().email(), // Email é string
  senha_hash: z.string().optional(), // 🔑 Adicionado para corresponder ao 'senha_hash' da API (se sua API retornar)
  tipo_usuario: z.string(), // 🆕 Adicionado: 'tipo_usuario' é uma string e é esperado da API
  createdAt: z.string().datetime().optional(), // 🗓️ Opcional: Data de criação, se a API retornar
  updatedAt: z.string().datetime().optional(), // 🔄 Opcional: Data de última atualização, se a API retornar
});

// 📊 Tipo para os dados de usuário recebidos da API.
export type ApiUser = z.infer<typeof apiUserSchema>;
