'use client';

import { ReactNode, useState } from 'react';
import {
    PawPrint,
    LayoutDashboard,
    Dog,
    Home,
    ShoppingCart,
    CreditCard,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    Bell,
    ChevronDown,
    Shield
} from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Dog, label: 'Hewan', href: '/admin/pets' },
    { icon: Home, label: 'Penitipan', href: '/admin/boarding' },
    { icon: ShoppingCart, label: 'Layanan', href: '/admin/services' },
    { icon: CreditCard, label: 'Pembayaran', href: '/admin/payments' },
    { icon: FileText, label: 'Laporan', href: '/admin/reports' },
    { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
];


import { signOutAdmin } from '@/lib/actions/auth';
import { useSession } from 'next-auth/react';

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);
    const { data: session } = useSession();

    const userName = session?.user?.name || 'Admin';
    const userEmail = session?.user?.email || 'admin@carepet.com';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        await signOutAdmin();
    };

    const notifications = [
        {
            id: '1',
            title: 'Pembayaran baru masuk',
            message: 'Pembayaran dari user@email.com sebesar Rp 600.000',
            time: '2 menit lalu',
            read: false,
        },
        {
            id: '2',
            title: 'Penitipan baru',
            message: 'Permintaan penitipan baru dari pelanggan',
            time: '15 menit lalu',
            read: false,
        },
        {
            id: '3',
            title: 'Hewan baru terdaftar',
            message: 'Bruno (Golden Retriever) telah terdaftar',
            time: '1 jam lalu',
            read: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Top Navbar - Fixed */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
                                <Shield size={24} />
                            </div>
                            <div>
                                <span className="text-base sm:text-lg font-bold text-white">Care Pet</span>
                                <p className="text-xs text-indigo-400 -mt-1 hidden sm:block">Admin Panel</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                                    className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Bell size={20} className="text-gray-300" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
                                </button>

                                {notifMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotifMenuOpen(false)} />
                                        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                                <h3 className="font-bold text-white">Notifikasi Admin</h3>
                                                <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                                                    {notifications.filter(n => !n.read).length} baru
                                                </span>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${!notif.read ? 'bg-indigo-500/5' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? 'bg-indigo-500' : 'bg-gray-500'}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-white text-sm">{notif.title}</p>
                                                                <p className="text-xs text-gray-400 truncate">{notif.message}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-3 border-t border-gray-700">
                                                <button className="w-full text-center text-sm text-indigo-400 font-medium hover:underline">
                                                    Lihat semua notifikasi
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Menu - Desktop */}
                            <div className="hidden sm:block relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {userInitial}
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-12 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-700">
                                                <p className="font-semibold text-white">{userName}</p>
                                                <p className="text-sm text-gray-400">{userEmail}</p>
                                            </div>
                                            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
                                                <Settings size={18} />
                                                <span>Pengaturan</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700"
                                            >
                                                <LogOut size={18} />
                                                <span>Keluar</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-700 bg-gray-800">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            {/* Mobile Navigation Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-700/50 hover:bg-indigo-500/10 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-indigo-500/10">
                                            <item.icon size={20} className="text-indigo-400" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-300 text-center">{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* User Section Mobile */}
                            <div className="pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {userInitial}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{userName}</p>
                                        <p className="text-xs text-gray-400">{userEmail}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg text-red-400 hover:bg-gray-700"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="pt-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

