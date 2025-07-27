import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(`Middleware: Requisição para ${request.nextUrl.pathname}`);
  const jwtToken = request.cookies.get('jwt_token')?.value;

  // 💡 Define as rotas públicas, que não precisa de autenticação
  const publicPaths = [
    '/login',
    '/register',
    '/',
    '/api/auth/login',
    '/api/auth/session',
  ];

  // Verifica se a rota atual é uma rota pública
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  console.log(`Middleware: Token JWT presente? ${!!jwtToken}`);
  console.log(`Middleware: É uma rota pública? ${isPublicPath}`);

  // Se o usuário não tem token E está tentando acessar uma rota protegida
  if (!jwtToken && !isPublicPath) {
    console.log(`Middleware: Redirecionando para login. Caminho protegido: ${request.nextUrl.pathname}`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário tem token E está tentando acessar a página de login/cadastro (já logado)
  if (jwtToken && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    console.log(`Middleware: Usuário logado tentando acessar login/cadastro. Redirecionando para /.`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log(`Middleware: Permissão concedida para ${request.nextUrl.pathname}`);
  // Se tudo estiver OK, permite que a requisição continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
