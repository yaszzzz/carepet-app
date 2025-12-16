import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { Dog, Search, Trash2, Edit, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminPetsPage() {
    const session = await auth();
    // In a real app, you'd check for admin role here specifically
    if (!session?.user) {
        redirect('/admin/login');
    }

    const pets = await prisma.hewan.findMany({
        include: {
            pengguna: true
        },
        orderBy: {
            id_hewan: 'desc'
        }
    });

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Hewan</h1>
                    <p className="text-gray-400 mt-1">Daftar semua hewan yang terdaftar di sistem.</p>
                </div>
                {/* Search could be a client component, for now just UI */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari hewan..."
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/50 text-gray-200 font-semibold border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Hewan</th>
                                <th className="px-6 py-4">Pemilik</th>
                                <th className="px-6 py-4">Jenis</th>
                                <th className="px-6 py-4">Usia</th>
                                <th className="px-6 py-4">Kebutuhan Khusus</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {pets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Dog size={32} className="opacity-50" />
                                            <p>Belum ada data hewan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pets.map((pet) => (
                                    <tr key={pet.id_hewan} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                    {pet.nama_hewan.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{pet.nama_hewan}</p>
                                                    <p className="text-xs text-gray-500">ID: {pet.id_hewan}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-300">{pet.pengguna.nama_pengguna}</p>
                                            <p className="text-xs text-gray-500">{pet.pengguna.no_hp}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-xs">
                                                {pet.jenis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {pet.usia} Tahun
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {pet.kebutuhan_khusus ? (
                                                <div className="flex items-center gap-2 text-amber-500">
                                                    <AlertCircle size={14} />
                                                    <span className="truncate">{pet.kebutuhan_khusus}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-lg hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
