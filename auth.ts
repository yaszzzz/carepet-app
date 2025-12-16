import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';
import { verifyPassword } from './lib/auth-utils';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        // Admin Credentials Provider
        Credentials({
            id: 'admin-credentials',
            name: 'Admin Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username as string },
                });

                if (!admin) {
                    return null;
                }

                const isPasswordValid = await verifyPassword(
                    credentials.password as string,
                    admin.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: admin.id_admin,
                    name: admin.nama_admin,
                    email: admin.username, // Using username as email for admin
                    role: 'admin' as const,
                };
            },
        }),

        // User Credentials Provider
        Credentials({
            id: 'user-credentials',
            name: 'User Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.pengguna.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await verifyPassword(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id_pengguna,
                    name: user.nama_pengguna,
                    email: user.email,
                    role: 'user' as const,
                };
            },
        }),
    ],
});
