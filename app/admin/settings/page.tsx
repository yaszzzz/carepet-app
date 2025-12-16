import { auth } from '@/auth';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { User, Lock, Mail, Save } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminSettingsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/admin/login');
    }

    return (
        <AdminDashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Pengaturan Akun</h1>
                <p className="text-gray-400 mt-1">Kelola informasi profil admin dan keamanan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-indigo-400" />
                        Informasi Profil
                    </h2>

                    <form className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    defaultValue={session.user.name || ''}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    defaultValue={session.user.email || ''}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                                    disabled // Usually email is not changeable easily
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                                <Save size={18} />
                                Simpan Perubahan
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

                    <form className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Password Saat Ini</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Password Baru</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                                <Save size={18} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
