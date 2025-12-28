import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { prisma } from '@/lib/prisma';
import {
    PawPrint,
    Home,
    Clock,
    CreditCard,
    Layers,
    Dog,
    ShoppingCart,
    FileText,
    Settings,
    ChevronRight,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';

// Management Menu Items
const managementItems = [
    {
        id: '1',
        label: 'Kelola Hewan',
        description: 'Tambah, edit, hapus data hewan',
        icon: Dog,
        href: '/admin/pets',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        id: '2',
        label: 'Kelola Penitipan',
        description: 'Atur jadwal dan status penitipan',
        icon: Home,
        href: '/admin/boarding',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        id: '3',
        label: 'Kelola Pemesanan Layanan',
        description: 'Grooming, kesehatan, dan lainnya',
        icon: ShoppingCart,
        href: '/admin/services',
        color: 'from-violet-500 to-purple-600',
    },
    {
        id: '4',
        label: 'Kelola Pembayaran',
        description: 'Verifikasi dan kelola transaksi',
        icon: CreditCard,
        href: '/admin/payments',
        color: 'from-amber-500 to-orange-600',
    },
    {
        id: '5',
        label: 'Laporan & Rekap Data',
        description: 'Statistik dan export laporan',
        icon: FileText,
        href: '/admin/reports',
        color: 'from-rose-500 to-pink-600',
    },
    {
        id: '6',
        label: 'Pengaturan Akun',
        description: 'Profil admin dan keamanan',
        icon: Settings,
        href: '/admin/settings',
        color: 'from-gray-500 to-gray-700',
    },
];

export default async function AdminDashboardPage() {
    // Fetch data concurrently
    const [totalHewan, activeBookings, pendingBookings, totalServices] = await Promise.all([
        prisma.hewan.count(),
        prisma.pemesanan.count({
            where: {
                status: {
                    in: ['Proses', 'Lunas', 'Menunggu Konfirmasi']
                }
            }
        }),
        prisma.pemesanan.count({
            where: {
                status: 'Menunggu Konfirmasi'
            }
        }),
        prisma.layanan.count()
    ]);

    const summaryStats = [
        {
            id: '1',
            label: 'Total Hewan Terdaftar',
            value: totalHewan.toString(),
            change: 'Data terbaru',
            icon: PawPrint,
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: '2',
            label: 'Penitipan Aktif',
            value: activeBookings.toString(),
            change: 'Sedang berlangsung',
            icon: Home,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: '3',
            label: 'Menunggu Konfirmasi',
            value: pendingBookings.toString(),
            change: 'Perlu tindakan',
            icon: Clock,
            color: 'from-amber-500 to-orange-600',
        },
        {
            id: '4',
            label: 'Total Layanan',
            value: totalServices.toString(),
            change: 'Tersedia',
            icon: Layers,
            color: 'from-indigo-500 to-purple-600',
        },
    ];

    return (
        <AdminDashboardLayout>
            {/* Dashboard Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-500/20">
                        <TrendingUp size={24} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin CarePet</h1>
                        <p className="text-gray-400 text-sm sm:text-base">Selamat datang! Kelola sistem CarePet dengan mudah.</p>
                    </div>
                </div>
            </div>

            {/* Ringkasan Sistem */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Users size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Ringkasan Sistem</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-5 hover:border-indigo-500/50 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manajemen Sistem */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Settings size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Manajemen Sistem</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {managementItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-gray-800 transition-all duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-105 transition-transform`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                            {item.label}
                                        </h3>
                                        <p className="text-sm text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
