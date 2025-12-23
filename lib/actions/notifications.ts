'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
}

export async function createNotification(data: {
    userId?: string; // If 'ADMIN' string or null, it's for admins.
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    link?: string;
}) {
    try {
        await prisma.notifikasi.create({
            data: {
                userId: data.userId || 'ADMIN',
                title: data.title,
                message: data.message,
                type: data.type,
                link: data.link
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to create notification:', error);
        return { error: 'Gagal membuat notifikasi' };
    }
}

import { isRateLimited } from '@/lib/rate-limit';

export async function getAdminNotifications(): Promise<NotificationItem[]> {
    const session = await auth();
    const userId = session?.user?.id || 'anonymous';

    // Rate limit: 20 requests per minute
    if (isRateLimited(`admin-notif-${userId}`, 20, 60000)) {
        console.warn('Rate limit exceeded for admin notifications');
        return [];
    }

    // if (!session?.user?.email) return []; // Allow broad access for now or check role if setup

    try {
        const notifications = await prisma.notifikasi.findMany({
            where: {
                userId: 'ADMIN' // Query for generic ADMIN notifications
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        return notifications.map((n) => ({
            id: n.id_notifikasi,
            title: n.title,
            message: n.message,
            time: formatDistanceToNow(n.createdAt, { addSuffix: true, locale: id }),
            read: n.isRead,
            type: n.type.toLowerCase() as NotificationItem['type'],
            link: n.link || '#'
        }));
    } catch (error) {
        console.error('Failed to get admin notifications:', error);
        return [];
    }
}

export async function getNotifications(): Promise<NotificationItem[]> {
    const session = await auth();
    if (!session?.user?.id) return []; // Need user ID

    // Rate limit: 20 requests per minute
    if (isRateLimited(`user-notif-${session.user.id}`, 20, 60000)) {
        console.warn('Rate limit exceeded for user notifications');
        return [];
    }

    try {
        const notifs = await prisma.notifikasi.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        return notifs.map((n) => ({
            id: n.id_notifikasi,
            title: n.title,
            message: n.message,
            time: formatDistanceToNow(n.createdAt, { addSuffix: true, locale: id }),
            read: n.isRead,
            type: (n.type.toLowerCase() as NotificationItem['type']) || 'info',
            link: n.link || undefined
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.notifikasi.update({
            where: { id_notifikasi: id },
            data: { isRead: true }
        });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal update status' };
    }
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    try {
        await prisma.notifikasi.updateMany({
            where: {
                userId: session.user.id,
                isRead: false
            },
            data: { isRead: true }
        });
        revalidatePath('/', 'layout');
        revalidatePath('/dashboard/notifications');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Gagal update status' };
    }
}

function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;

    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}
