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
    try {
        // Check if email already exists
        const existingUser = await prisma.pengguna.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return { error: 'Email sudah terdaftar' };
        }

        // Generate unique ID (format: PG0001, PG0002, etc.)
        const lastUser = await prisma.pengguna.findFirst({
            orderBy: { id_pengguna: 'desc' },
        });

        let newId = 'PG0001';
        if (lastUser) {
            const lastNumber = parseInt(lastUser.id_pengguna.replace('PG', ''));
            newId = `PG${String(lastNumber + 1).padStart(4, '0')}`;
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

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
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Terjadi kesalahan saat mendaftar' };
    }
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
export async function signOutAdmin() {
    await nextAuthSignOut({ redirectTo: '/admin/login' });
}

