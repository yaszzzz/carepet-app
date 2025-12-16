'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { AuthError } from 'next-auth';

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
