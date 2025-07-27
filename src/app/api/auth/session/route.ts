// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  console.log("API de Sessão: Requisição recebida.");
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    if (!token) {
      console.log("API de Sessão: Token JWT não encontrado no cookie.");
      return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("API de Sessão: JWT_SECRET não está definido nas variáveis de ambiente!");
      throw new Error("A variável de ambiente JWT_SECRET não está definida.");
    }
    console.log("API de Sessão: Token JWT encontrado. Tentando verificar...");

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, jwtSecret) as { id: number; nome: string; email: string };
    console.log("API de Sessão: Token JWT verificado com sucesso. Decodificado:", decoded);

    // Retorna os dados do usuário (sem a senha hash)
    return NextResponse.json({ id: decoded.id, nome: decoded.nome, email: decoded.email });

  } catch (error) {
    console.error("API de Sessão: Erro ao verificar token ou na API:", error);
    // Se o token for inválido ou expirado, ou qualquer outro erro
    return NextResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 });
  }
}
