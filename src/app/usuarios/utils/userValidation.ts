import { z } from "zod"; // 🚀 Importa a biblioteca Zod para validação

// 📝 Schema para criar/atualizar um usuário via formulário (com senha)
// Define a estrutura e as regras de validação para os dados que o usuário vai enviar.
export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres. 😟"), // Nome é string e tem mínimo de 3 caracteres
  email: z.string().email("E-mail inválido. 📧"), // Email deve ser um formato de email válido
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres. 🔑"), // Senha é string e tem mínimo de 6 caracteres
  telefone: z.string().optional(),
  // ✨ Outros campos opcionais do usuário API ReUSE
  // exemplo: endereco: z.string().optional(),
  tipo_usuario: z.string().optional(), // 🆕 Adicionado para permitir na criação/atualização se necessário
});

// 💡 Tipo inferido do schema, super útil para tipagem no React Hook Form e requisições Axios.
export type UserFormData = z.infer<typeof userSchema>;

// 📥 Schema para um usuário que vem diretamente da API
// Estende o 'userSchema' com campos adicionais que a API pode retornar, como IDs e timestamps.
export const apiUserSchema = userSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime().optional(), // 🗓️ Opcional: Data de criação, se a API retornar
  updatedAt: z.string().datetime().optional(), // 🔄 Opcional: Data de última atualização, se a API retornar
  senha_hash: z.string().optional(), // 🔑 Adicionado para corresponder ao 'senha_hash' da API
  tipo_usuario: z.string(), // 🆕 Adicionado: 'tipo_usuario' é uma string e é esperado da API
});

// 📊 Tipo para os dados de usuário recebidos da API.
export type ApiUser = z.infer<typeof apiUserSchema>;
