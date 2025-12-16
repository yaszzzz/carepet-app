'use client';

import { ReactNode, useState } from 'react';
import {
    PawPrint,
    Home,
    History,
    ShoppingCart,
    Clock,
    CreditCard,
    Settings,
    Menu,
    X,
    LogOut,
    Bell,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: PawPrint, label: 'Hewan Saya', href: '/dashboard#pets' },
    { icon: Clock, label: 'Status', href: '/dashboard#status' },
    { icon: History, label: 'Riwayat', href: '/dashboard#boarding-history' },
    { icon: ShoppingCart, label: 'Layanan', href: '/dashboard#services' },
    { icon: CreditCard, label: 'Pembayaran', href: '/dashboard#payments' },
    { icon: Settings, label: 'Pengaturan', href: '/dashboard#settings' },
];


import { signOutUser } from '@/lib/actions/auth';

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOutUser();
    };

    const notifications = [
        {
            id: '1',
            title: 'Mochi sudah diberi makan',
            message: 'Pengasuh baru saja memberi makan Mochi',
            time: '5 menit lalu',
            read: false,
        },
        {
            id: '2',
            title: 'Pembayaran berhasil',
            message: 'Pembayaran untuk grooming Bruno berhasil',
            time: '1 jam lalu',
            read: false,
        },
        {
            id: '3',
            title: 'Jadwal vaksinasi',
            message: 'Pengingat: Vaksinasi Mochi besok pukul 10:00',
            time: '2 jam lalu',
            read: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5 ">
            {/* Top Navbar - Fixed */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-gradient-to-br from-[#658C58] to-[#31694E] p-2 rounded-xl text-white shadow-lg">
                                <PawPrint size={24} />
                            </div>
                            <div>
                                <span className="text-base sm:text-lg font-bold text-gray-800">Care Pet</span>
                                <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Dashboard</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-[#658C58]/10 hover:text-[#31694E] transition-all duration-200 text-sm font-medium"
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
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Bell size={20} className="text-gray-600" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {notifMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotifMenuOpen(false)} />
                                        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#658C58]/10 to-[#BBC863]/10">
                                                <h3 className="font-bold text-gray-800">Notifikasi</h3>
                                                <span className="text-xs bg-[#658C58] text-white px-2 py-0.5 rounded-full">
                                                    {notifications.filter(n => !n.read).length} baru
                                                </span>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-[#F0E491]/10' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? 'bg-[#658C58]' : 'bg-gray-300'}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-gray-800 text-sm">{notif.title}</p>
                                                                <p className="text-xs text-gray-600 truncate">{notif.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-3 border-t border-gray-100">
                                                <button className="w-full text-center text-sm text-[#658C58] font-medium hover:underline">
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
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#658C58] to-[#31694E] flex items-center justify-center text-white text-sm font-bold">
                                        A
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-gray-800">Akun Saya</p>
                                                <p className="text-sm text-gray-500">user@email.com</p>
                                            </div>
                                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                                <Settings size={18} />
                                                <span>Pengaturan</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
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
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            {/* Mobile Navigation Grid */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {menuItems.slice(0, 4).map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 hover:bg-[#658C58]/10 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-[#658C58]/10">
                                            <item.icon size={20} className="text-[#658C58]" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {menuItems.slice(4).map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 hover:bg-[#658C58]/10 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-[#658C58]/10">
                                            <item.icon size={20} className="text-[#658C58]" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* User Section Mobile */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#F0E491]/20 to-[#BBC863]/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#658C58] to-[#31694E] flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Akun Saya</p>
                                        <p className="text-xs text-gray-500">user@email.com</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
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

