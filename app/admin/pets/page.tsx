import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboardLayout } from '@/components/templates/AdminDashboardLayout/AdminDashboardLayout';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { Dog, Search, Trash2, Edit, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AdminPetRow } from '@/components/molecules/AdminPetRow';

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
                                pets.map(pet => (
                                    <AdminPetRow
                                        key={pet.id_hewan}
                                        pet={pet}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
