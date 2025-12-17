'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hash, compare } from 'bcryptjs';

export async function updateAdminProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const name = formData.get('name') as string;

    try {
        await prisma.admin.update({
            where: { username: session.user.email }, // assuming email is stored as username or looked up via auth logic
            // Wait, helper: Admin table has `username`, NO `email`. Auth logic maps `username` to session email?
            // Let's check auth.ts logic.
            // In auth.ts:
            // authorize: async (credentials) => { ... const user = await prisma.admin.findUnique({ where: { username: credentials.email } }); ... }
            // So session.user.email holds the username.
            data: { nama_admin: name }
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal update profil' };
    }
}

export async function updateAdminPassword(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        return { error: 'Password baru tidak cocok' };
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { username: session.user.email } // session email is username
        });

        if (!admin) return { error: 'Admin not found' };

        const isValid = await compare(currentPassword, admin.password);
        if (!isValid) {
            return { error: 'Password lama salah' };
        }

        const hashedPassword = await hash(newPassword, 10);

        await prisma.admin.update({
            where: { username: session.user.email },
            data: { password: hashedPassword }
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal update password' };
    }
}
