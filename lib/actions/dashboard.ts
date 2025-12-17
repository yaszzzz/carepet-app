'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const userEmail = session.user.email;
    const user = await prisma.pengguna.findUnique({
        where: { email: userEmail },
        include: { hewan: true }
    });

    if (!user) return null;

    // 1. Total Pets
    const totalPets = await prisma.hewan.count({
        where: { id_pengguna: user.id_pengguna }
    });

    // 2. Active Boardings (Status NOT 'Selesai' and NOT 'Batal')
    const activeBoardings = await prisma.pemesanan.count({
        where: {
            hewan: { id_pengguna: user.id_pengguna },
            status: { in: ['Menunggu Pembayaran', 'Lunas', 'Proses', 'Diterima'] }
            // Adjustable based on what "Active" means. Usually 'Proses' means in boarding.
        }
    });

    // 3. Service Orders (Total bookings made)
    const serviceOrders = await prisma.pemesanan.count({
        where: {
            hewan: { id_pengguna: user.id_pengguna }
        }
    });

    // 4. Completed/History count
    const historyCount = await prisma.pemesanan.count({
        where: {
            hewan: { id_pengguna: user.id_pengguna },
            status: 'Selesai'
        }
    });

    return {
        totalPets,
        activeBoardings,
        serviceOrders,
        historyCount,
        userName: user.nama_pengguna
    };
}

export async function getActiveBoarding() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.pengguna.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return null;

    // Find one active boarding to display
    const activeBooking = await prisma.pemesanan.findFirst({
        where: {
            hewan: { id_pengguna: user.id_pengguna },
            status: { in: ['Proses', 'Diterima', 'Lunas'] }, // Priorities for "Active" display
            tgl_keluar: { gte: new Date() } // Must not be expired
        },
        orderBy: { tgl_masuk: 'asc' },
        include: { hewan: true }
    });

    if (!activeBooking) return null;

    // Calculate days remaining
    const today = new Date();
    const end = new Date(activeBooking.tgl_keluar);
    const diffTime = end.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
        petName: activeBooking.hewan.nama_hewan,
        daysRemaining
    };
}
