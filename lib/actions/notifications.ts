'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean; // Computed or default
    type: 'info' | 'success' | 'warning' | 'error';
}

export async function getNotifications(): Promise<NotificationItem[]> {
    const session = await auth();
    if (!session?.user?.email) return [];

    const user = await prisma.pengguna.findUnique({
        where: { email: session.user.email },
        include: {
            hewan: {
                include: {
                    pemesanan: {
                        orderBy: { tgl_masuk: 'desc' },
                        take: 5, // Last 5 activities
                        include: { layanan: true }
                    }
                }
            }
        }
    });

    if (!user) return [];

    const notifications: NotificationItem[] = [];

    // Flatten all bookings from all pets
    const allBookings = user.hewan.flatMap(pet =>
        pet.pemesanan.map(booking => ({ ...booking, petName: pet.nama_hewan }))
    ).sort((a, b) => new Date(b.tgl_masuk).getTime() - new Date(a.tgl_masuk).getTime())
        .slice(0, 10);

    // Generate notifications based on status
    for (const booking of allBookings) {
        // We use a deterministic ID based on status + id to avoid duplicates in React keys if status changes
        // But for a simple list, booking ID is fine if we only show latest status.

        let title = '';
        let message = '';
        let type: NotificationItem['type'] = 'info';

        // Logic for Notification Content
        switch (booking.status) {
            case 'Menunggu Pembayaran':
                title = 'Menunggu Pembayaran';
                message = `Mohon selesaikan pembayaran untuk layanan ${booking.layanan.nama_layanan} (${booking.petName}).`;
                type = 'warning';
                break;
            case 'Lunas':
            case 'Diterima':
                title = 'Booking Dikonfirmasi';
                message = `Booking untuk ${booking.petName} telah dikonfirmasi.`;
                type = 'success';
                break;
            case 'Selesai':
                title = 'Layanan Selesai';
                message = `Layanan untuk ${booking.petName} telah selesai. Terima kasih!`;
                type = 'info';
                break;
            case 'Batal':
                title = 'Booking Dibatalkan';
                message = `Booking untuk ${booking.petName} telah dibatalkan.`;
                type = 'error';
                break;
            default:
                title = 'Status Booking Update';
                message = `Status booking ${booking.petName}: ${booking.status}`;
        }

        if (title) {
            notifications.push({
                id: `${booking.id_pemesanan}-${booking.status}`,
                title,
                message,
                time: formatDate(booking.tgl_masuk), // Ideally use updatedAt if available
                read: false, // Cannot track 'read' status without DB table
                type
            });
        }
    }

    return notifications;
}

function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    // Convert to relative time
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} menit lalu`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;

    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}

export async function getAdminNotifications(): Promise<NotificationItem[]> {
    const session = await auth();
    // Assuming admin role check or loose check for now since it's used in Admin Layout
    if (!session?.user?.email) return [];

    // Fetch recent bookings that might need attention
    const bookings = await prisma.pemesanan.findMany({
        where: {
            status: {
                in: ['Menunggu Pembayaran', 'Baru'] // Adjust if 'Baru' exists, otherwise just Menunggu Pembayaran
            }
        },
        orderBy: { tgl_masuk: 'desc' },
        take: 10,
        include: {
            hewan: {
                include: {
                    pengguna: true
                }
            },
            pembayaran: true // Check if payment proof exists?
        }
    });

    const notifications: NotificationItem[] = [];

    for (const booking of bookings) {
        let title = '';
        let message = '';
        let type: NotificationItem['type'] = 'info';

        if (booking.status === 'Menunggu Pembayaran') {
            const hasProof = booking.pembayaran.some(p => p.bukti_bayar);
            if (hasProof) {
                title = 'Verifikasi Pembayaran';
                message = `Bukti bayar diunggah oleh ${booking.hewan.pengguna.nama_pengguna}.`;
                type = 'warning';
            } else {
                title = 'Booking Baru';
                message = `Booking baru dari ${booking.hewan.pengguna.nama_pengguna} (${booking.hewan.nama_hewan}).`;
                type = 'info';
            }
        }

        if (title) {
            notifications.push({
                id: `admin-${booking.id_pemesanan}`,
                title,
                message,
                time: formatDate(booking.tgl_masuk), // Or createdAt if available similar to before
                read: false,
                type
            });
        }
    }

    return notifications;
}
