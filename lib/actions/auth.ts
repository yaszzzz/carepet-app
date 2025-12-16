'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

/**
 * Register a new User
 * @param data - Registration data
 * @returns Success or error message
 */
export async function registerUser(data: {
    nama: string;
    email: string;
    password: string;
    no_hp: string;
    alamat: string;
}) {
    // Hash password once
    const hashedPassword = await hashPassword(data.password);

    // Max retries for ID generation
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            // Check if email already exists (fail fast)
            const existingUser = await prisma.pengguna.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                return { error: 'Email sudah terdaftar' };
            }

            // Generate unique ID (format: PG0001, PG0002, etc.)
            // Only look for IDs that follow the standard format 'PG' to avoid parsing errors
            // from legacy or non-standard IDs (e.g. 'USER1').
            const lastUser = await prisma.pengguna.findFirst({
                where: {
                    id_pengguna: {
                        startsWith: 'PG'
                    }
                },
                orderBy: { id_pengguna: 'desc' },
            });

            let newId = 'PG0001';
            if (lastUser) {
                const lastNumber = parseInt(lastUser.id_pengguna.replace('PG', ''));
                if (!isNaN(lastNumber)) {
                    newId = `PG${String(lastNumber + 1).padStart(4, '0')}`;
                }
            }

            // Create user
            await prisma.pengguna.create({
                data: {
                    id_pengguna: newId,
                    nama_pengguna: data.nama,
                    email: data.email,
                    password: hashedPassword,
                    no_hp: data.no_hp,
                    alamat: data.alamat,
                },
            });

            return { success: true };

        } catch (error: any) {
            // Handle Prisma known request errors
            if (error.code === 'P2002') {
                const target = error.meta?.target;

                // Check if error is due to email (no retry needed)
                if (
                    (Array.isArray(target) && target.includes('email')) ||
                    (typeof target === 'string' && target.includes('email'))
                ) {
                    return { error: 'Email sudah terdaftar' };
                }

                // Check if error is due to id_pengguna (retry needed)
                if (
                    (Array.isArray(target) && target.includes('id_pengguna')) ||
                    (typeof target === 'string' && target.includes('id_pengguna'))
                ) {
                    attempt++;
                    console.log(`ID Collision detected, retrying (Attempt ${attempt}/${MAX_RETRIES})...`);
                    continue; // Retry the loop
                }
            }

            console.error('Registration error:', error);
            return { error: 'Terjadi kesalahan saat mendaftar' };
        }
    }

    return { error: 'Gagal membuat ID unik. Silakan coba lagi.' };
}

/**
 * Sign in as Admin
 * @param username - Admin username
 * @param password - Admin password
 * @returns Success or error message
 */
export async function signInAdmin(username: string, password: string) {
    try {
        await nextAuthSignIn('admin-credentials', {
            username,
            password,
            redirectTo: '/admin/dashboard',
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid username or password' };
                default:
                    return { error: 'Something went wrong' };
            }
        }
        throw error;
    }
}

/**
 * Sign in as User
 * @param email - User email
 * @param password - User password
 * @returns Success or error message
 */
export async function signInUser(email: string, password: string) {
    try {
        await nextAuthSignIn('user-credentials', {
            email,
            password,
            redirectTo: '/dashboard',
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid email or password' };
                default:
                    return { error: 'Something went wrong' };
            }
        }
        throw error;
    }
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
    await nextAuthSignOut({ redirectTo: '/login' });
}

/**
 * Sign out the current admin
 */
/**
 * Sign out the current admin
 */
export async function signOutAdmin() {
    await nextAuthSignOut({ redirectTo: '/admin/login' });
}

/**
 * Trigger Social Sign In
 * @param provider - 'google' or 'facebook'
 */
export async function socialSignIn(provider: 'google' | 'facebook') {
    await nextAuthSignIn(provider, { redirectTo: '/dashboard' });
}

