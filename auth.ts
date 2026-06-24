import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verify } from '@node-rs/argon2';
import { GafetService } from '@/app/services/api';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await GafetService.getByEmail(credentials.email as string);
          if (!user) return null;

          const valid = await verify(user.password, credentials.password as string);
          if (!valid) return null;

          return { id: user._id, email: user.correo };
        } catch {
          return null;
        }
      },
    }),
  ],
});
