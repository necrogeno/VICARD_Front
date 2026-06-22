// auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  pages: {
    signIn: '/gafetdigital/administrador/Login', // Redirige automáticamente aquí si no está autenticado
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirige automáticamente a /login
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Aquí conectas con tu API externa (ej. Flask) para validar usuario
        // const res = await fetch("https://tu-api.com/login", { ... })
        // const user = await res.json()

        if (credentials.email === 'admin@mail.com' && credentials.password === 'password123') {
          return { id: '1', name: 'Admin', email: 'admin@mail.com' };
        }
        return null; // Credenciales inválidas
      },
    }),
  ],
} satisfies NextAuthConfig;