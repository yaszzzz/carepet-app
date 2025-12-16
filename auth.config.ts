import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLogin = nextUrl.pathname.startsWith('/login');
            const isOnAdminLogin = nextUrl.pathname === '/admin/login';

            // Protect dashboard routes - require user auth
            if (isOnDashboard) {
                if (isLoggedIn && auth.user.role === 'user') return true;
                return false; // Redirect unauthenticated users to login page
            }

            // Protect admin routes - require admin auth
            if (isOnAdmin && !isOnAdminLogin) {
                if (isLoggedIn && auth.user.role === 'admin') return true;
                return false; // Redirect unauthenticated admins to admin login
            }

            // Redirect logged-in users away from login pages
            if (isLoggedIn && (isOnLogin || isOnAdminLogin)) {
                if (auth.user.role === 'admin') {
                    return Response.redirect(new URL('/admin/dashboard', nextUrl));
                }
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'admin' | 'user';
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
