import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';
import { verifyPassword, hashPassword } from './lib/auth-utils';

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
                    image: user.foto, // Include profile picture
                };
            },
        }),

        // Social Providers
        Google,
        Facebook,
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Only handle social login here
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                if (!user.email) return false;

                try {
                    // Check if user exists
                    const existingUser = await prisma.pengguna.findUnique({
                        where: { email: user.email },
                    });

                    if (existingUser) {
                        // Optional: Update profile picture if logged in via social and it's missing or changed
                        // For now, we just let them sign in.
                        // We also need to ensuring the account is linked if using Adapter, but we are using manual logic here.
                        return true;
                    }

                    // User does not exist, create new one
                    // 1. Generate ID
                    // 1. Generate ID
                    const lastUsers = await prisma.pengguna.findMany({
                        where: { id_pengguna: { startsWith: 'PG' } },
                        orderBy: { id_pengguna: 'desc' },
                        take: 5
                    });

                    let maxId = 0;
                    if (lastUsers.length > 0) {
                        for (const user of lastUsers) {
                            const idStr = user.id_pengguna.replace('PG', '');
                            if (/^\d+$/.test(idStr)) {
                                const num = parseInt(idStr, 10);
                                if (num > maxId) maxId = num;
                            }
                        }
                    }

                    const newId = `PG${String(maxId + 1).padStart(4, '0')}`;

                    // 2. Create User
                    // Note: We need a dummy password. 
                    // In a real app, you might make password optional or use a specific flag.
                    // Here we'll generate a random strong hash that no one knows.
                    const dummyPassword = await hashPassword(Math.random().toString(36) + Date.now().toString());

                    await prisma.pengguna.create({
                        data: {
                            id_pengguna: newId,
                            nama_pengguna: user.name || 'Pengguna',
                            email: user.email,
                            password: dummyPassword,
                            no_hp: '-', // Default value as it's required
                            alamat: '-', // Default value as it's required
                            foto: user.image || null, // Save profile picture
                        },
                    });

                    return true;
                } catch (error) {
                    console.error('Social login error:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                // If it's a social login, we need to fetch the ID we just created/found from DB
                // because the `user` object from provider might not have our internal ID.
                if (account?.provider === 'google' || account?.provider === 'facebook') {
                    if (user.email) {
                        const dbUser = await prisma.pengguna.findUnique({
                            where: { email: user.email },
                        });
                        if (dbUser) {
                            token.id = dbUser.id_pengguna;
                            token.role = 'user';
                            token.picture = dbUser.foto; // Use our DB photo
                        }
                    }
                } else {
                    // Credentials login
                    token.id = user.id;
                    // @ts-ignore
                    token.role = user.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
                // @ts-ignore
                session.user.image = token.picture;
            }
            return session;
        }
    },
});
