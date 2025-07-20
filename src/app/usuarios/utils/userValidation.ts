import { z } from "zod";

// 📝 Schema para criar/atualizar um usuário via formulário (com senha)
// Define a estrutura e as regras de validação para os dados que o usuário vai enviar.
export const userSchema = z.object({
  id: z.string().optional(), // ID é opcional (gerado pelo backend)
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome não pode exceder 100 caracteres."),
  email: z
    .email("Formato de e-mail inválido.")
    .min(1, "O e-mail é obrigatório."),
  tipo_usuario: z.enum(
    ["doador", "receptor"],
    'Tipo de usuário inválido. Escolha "doador" ou "receptor".'
  ),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(50, "A senha não pode exceder 50 caracteres."),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
// 💡 Tipo inferido do schema, super útil para tipagem no React Hook Form e requisições Axios.
export type UserFormData = z.infer<typeof userSchema>;

// 📥 Schema para um usuário que vem diretamente da API
export const apiUserSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.email(),
  senha_hash: z.string(),
  tipo_usuario: z.enum(["doador", "receptor"]),
});

// 📊 Tipo para os dados de usuário recebidos da API.
export type ApiUser = z.infer<typeof apiUserSchema>;
export const userEditSchema = userSchema.partial({ senha: true });
export type UserEditFormData = z.infer<typeof userEditSchema>;
