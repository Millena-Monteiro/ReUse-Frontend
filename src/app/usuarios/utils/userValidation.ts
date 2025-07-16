import { z } from "zod";

export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres. 😟"),
  email: z.string().email("E-mail inválido. 📧"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres. 🔑"),
});
export type UserFormData = z.infer<typeof userSchema>;

export const apiUserSchema = userSchema.extend({
  _id: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type ApiUser = z.infer<typeof apiUserSchema>;
