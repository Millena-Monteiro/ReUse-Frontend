import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      nome?: string;
      token?: string;
    };
  }

  /**
   * Estende a interface 'JWT' para incluir propriedades personalizadas no token JWT.
   * As propriedades aqui devem corresponder às que é adicionada no callback 'jwt'.
   */
  interface JWT {
    accessToken?: string;
    id?: string;
    // 💡 Adicionar outras propriedades personalizadas do JWT aqui
    token?: string;
  }
}
