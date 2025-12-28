'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

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
    let oldPhotoUrl: string | null = null;

    if (photo && photo.size > 0) {
        try {
            const currentUser = await prisma.pengguna.findUnique({
                where: { id_pengguna: session.user.id },
                select: { foto: true }
            });
            oldPhotoUrl = currentUser?.foto || null;

            photoUrl = await uploadToBlob(photo, 'profiles');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            // Continue update even if photo fails
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

        if (photoUrl && oldPhotoUrl) {
            await deleteFromBlob(oldPhotoUrl);
        }

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
