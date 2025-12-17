'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const nama_pengguna = formData.get('nama') as string;
    const no_hp = formData.get('no_hp') as string;
    const alamat = formData.get('alamat') as string;
    const photo = formData.get('photo') as File | null;

    let photoUrl;

    if (photo && photo.size > 0) {
        try {
            const bytes = await photo.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure directory exists
            const uploadDir = join(process.cwd(), 'public/uploads/profiles');
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${session.user.id}-${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const filePath = join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            photoUrl = `/uploads/profiles/${fileName}`;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            // Continue update even if photo fails? Maybe return error.
            // For now, let's just log and skip photo update.
        }
    }

    try {
        const dataToUpdate: any = {
            nama_pengguna,
            no_hp,
            alamat
        };

        if (photoUrl) {
            dataToUpdate.foto = photoUrl;
        }

        await prisma.pengguna.update({
            where: { id_pengguna: session.user.id },
            data: dataToUpdate
        });

        revalidatePath('/dashboard/settings');
        revalidatePath('/', 'layout'); // Update Navbar everywhere
        return { success: true };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { error: 'Gagal memperbarui profil' };
    }
}

export async function changePassword(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        return { error: 'Konfirmasi password tidak cocok' };
    }

    try {
        const user = await prisma.pengguna.findUnique({
            where: { id_pengguna: session.user.id }
        });

        if (!user) return { error: 'User not found' };

        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
            return { error: 'Password saat ini salah' };
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.pengguna.update({
            where: { id_pengguna: session.user.id },
            data: {
                password: hashedPassword
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to change password:', error);
        return { error: 'Gagal mengubah password' };
    }
}
