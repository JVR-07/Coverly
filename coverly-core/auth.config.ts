import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = nextUrl.pathname.startsWith('/login');

      if (isAuthRoute) {
        if (isLoggedIn) {
          // Si está logueado y trata de ir al login, llévalo al dashboard
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      // Proteger todas las rutas por default excepto las públicas (asumiendo que las públicas se definen o manejan distinto)
      // En este caso Coverly es uso interno, todo requiere auth excepto login y api pública.
      if (!isLoggedIn) {
        return false; // Redirigirá a signIn page (/login)
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Añadidos en auth.ts para evitar errores de edge
} satisfies NextAuthConfig;
