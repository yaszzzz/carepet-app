'use client';

import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Settings, User, Lock, Bell, Shield, Key } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <AdminDashboardLayout>
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                        <Settings size={24} className="text-gray-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Pengaturan Akun</h1>
                        <p className="text-gray-400 text-sm sm:text-base">Kelola profil admin dan preferensi keamanan.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Settings Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden sticky top-24">
                        <nav className="flex flex-col p-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile'
                                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                                    }`}
                            >
                                <User size={18} />
                                <span>Profil Saya</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security'
                                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                                    }`}
                            >
                                <Shield size={18} />
                                <span>Keamanan</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'notifications'
                                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                                    }`}
                            >
                                <Bell size={18} />
                                <span>Notifikasi</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                                <User size={20} className="text-indigo-400" />
                                <h2 className="text-xl font-bold text-white">Informasi Profil</h2>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 items-start">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative group cursor-pointer">
                                        <span>A</span>
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-xs font-medium">Ubah</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-semibold">Admin Utama</p>
                                        <p className="text-xs text-gray-400">Super Admin</p>
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div className="flex-1 w-full space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium">Nama Depan</label>
                                            <input
                                                type="text"
                                                defaultValue="Admin"
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 font-medium">Nama Belakang</label>
                                            <input
                                                type="text"
                                                defaultValue="CarePet"
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 font-medium">Email Address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                defaultValue="admin@carepet.com"
                                                disabled
                                                className="w-full bg-gray-900/30 border border-gray-700/50 rounded-xl px-4 py-2.5 text-gray-400 cursor-not-allowed"
                                            />
                                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">Email tidak dapat diubah karena merupakan ID login.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 font-medium">Bio Singkat</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                            placeholder="Tuliskan deskripsi singkat..."
                                            defaultValue="Administrator sistem Care Pet."
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20">
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                                <Key size={20} className="text-indigo-400" />
                                <h2 className="text-xl font-bold text-white">Keamanan & Password</h2>
                            </div>

                            <div className="max-w-2xl space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium">Password Saat Ini</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 font-medium">Password Baru</label>
                                        <input
                                            type="password"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="Minimal 8 karakter"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 font-medium">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="Ulangi password baru"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-700/50">
                                    <button className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                                <Bell size={20} className="text-indigo-400" />
                                <h2 className="text-xl font-bold text-white">Preferensi Notifikasi</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Notifikasi Email', description: 'Terima ringkasan mingguan aktivitas.' },
                                    { title: 'Notifikasi Sistem', description: 'Notifikasi popup saat ada pesanan baru.' },
                                    { title: 'Notifikasi Keamanan', description: 'Peringatan saat ada login mencurigakan.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700/50">
                                        <div>
                                            <p className="font-medium text-white">{item.title}</p>
                                            <p className="text-xs text-gray-400">{item.description}</p>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 cursor-pointer transition-colors">
                                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
