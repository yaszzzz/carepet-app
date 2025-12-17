'use client';

import { useState } from 'react';
import { User, Lock, Mail, Save, AlertCircle } from 'lucide-react';
import { updateAdminProfile, updateAdminPassword } from '@/lib/actions/admin/settings';
import { toast } from 'sonner';

export const AdminSettingsForms = ({ user }: { user: { name?: string | null, email?: string | null } }) => {
    const [isProfileLoading, setProfileLoading] = useState(false);
    const [isPasswordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (formData: FormData) => {
        setProfileLoading(true);
        const result = await updateAdminProfile(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Profil berhasil diperbarui");
        }
        setProfileLoading(false);
    };

    const handlePasswordUpdate = async (formData: FormData) => {
        setPasswordLoading(true);
        const result = await updateAdminPassword(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Password berhasil diperbarui");
            (document.getElementById('password-form') as HTMLFormElement)?.reset();
        }
        setPasswordLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User size={20} className="text-indigo-400" />
                    Informasi Profil
                </h2>

                <form action={handleProfileUpdate} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                name="name"
                                type="text"
                                defaultValue={user.name || ''}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Email (Username)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                defaultValue={user.email || ''}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isProfileLoading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isProfileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-indigo-400" />
                    Keamanan
                </h2>

                <form id="password-form" action={handlePasswordUpdate} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Password Saat Ini</label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Password Baru</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Konfirmasi Password Baru</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isPasswordLoading ? 'Mengupdate...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
