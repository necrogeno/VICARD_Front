import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/gafetdigital/Administrador/Login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicProfile = nextUrl.pathname.startsWith('/gafetdigital/gafetdigital/');
      const isLoginPage = nextUrl.pathname.startsWith('/gafetdigital/Administrador/Login');
      if (isPublicProfile || isLoginPage) return true;
      return isLoggedIn;
    },
  },
  providers: [],
};
