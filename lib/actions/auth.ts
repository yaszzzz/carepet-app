'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { generateUserId } from '@/lib/user-utils';

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

            // Generate unique ID
            const newId = await generateUserId();

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

                // If it's ID collision, the loop would handle it if we were doing it manually,
                // but generateUserId also has retries. If it fails here, it might be a race condition 
                // between generateUserId and create. 
                // We'll let the outer loop retry if it was ID related (though generateUserId tries to avoid it).
                if (
                    (Array.isArray(target) && target.includes('id_pengguna')) ||
                    (typeof target === 'string' && target.includes('id_pengguna'))
                ) {
                    attempt++;
                    console.log(`ID Collision detected during create, retrying (Attempt ${attempt}/${MAX_RETRIES})...`);
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
 * Send Forgot Password Email (Stub)
 * @param email - User email
 */
export async function forgotPassword(email: string) {
    // 1. Check if user exists
    const user = await prisma.pengguna.findUnique({
        where: { email }
    });

    if (!user) {
        // Return success even if user not found to prevent enumeration
        return { success: true, message: 'Jika email terdaftar, link reset akan dikirim.' };
    }

    // 2. Generate Reset Token (In a real app, save this to DB with expiry)
    const resetToken = crypto.randomUUID();

    // 3. Send Email (Stub)
    console.log(`[EMAIL STUB] Sending Password Reset Link to ${email}`);
    console.log(`[EMAIL STUB] Token: ${resetToken}`);
    console.log(`[EMAIL STUB] Link: http://localhost:3000/reset-password?token=${resetToken}`);

    // In production, use an email provider here (e.g. Resend, Nodemailer)

    return { success: true, message: 'Jika email terdaftar, link reset akan dikirim.' };
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
    await nextAuthSignOut({ redirectTo: '/' });
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

