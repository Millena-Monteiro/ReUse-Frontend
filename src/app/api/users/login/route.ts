import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const users = [
  {
    id: 1,
    nome: 'Usuário Teste',
    email: 'teste@email.com',
    passwordHash: '$2a$12$rOlYHfDlqxmo6UNPjl/Y6edZO4N6EAob4E8QV6xTKvEYVhhXqI29e', 
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }
    
    console.log("SUCESSO: Credenciais validadas!");

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("A variável de ambiente JWT_SECRET não está definida.");
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

   
    const cookieStore = await cookies();

    cookieStore.set('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });

    return NextResponse.json({ id: user.id, nome: user.nome, email: user.email });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return NextResponse.json({ message: 'Ocorreu um erro interno no servidor.' }, { status: 500 });
  }
}