'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { deletePetAdmin } from '@/lib/actions/admin/pet';

interface AdminPetRowProps {
    pet: {
        id_hewan: string;
        nama_hewan: string;
        jenis: string;
        umur: number;
        kebutuhan_khusus?: string | null;
        pengguna: {
            nama_pengguna: string;
            no_hp?: string | null;
        };
    };
}

export const AdminPetRow = ({ pet }: AdminPetRowProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus ${pet.nama_hewan}?`)) return;

        setIsDeleting(true);
        const result = await deletePetAdmin(pet.id_hewan);

        if (result?.success) {
            router.refresh();
        } else {
            alert('Gagal menghapus hewan');
            setIsDeleting(false);
        }
    };

    return (
        <tr className="hover:bg-gray-700/50 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                #{pet.id_hewan}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                        {pet.jenis === 'Kucing' ? '🐱' : '🐶'}
                    </div>
                    <div>
                        <p className="font-medium text-white">{pet.nama_hewan}</p>
                        <p className="text-xs text-gray-500">{pet.jenis} • {pet.umur} Tahun</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="font-medium text-gray-300">{pet.pengguna.nama_pengguna}</p>
                <p className="text-xs text-gray-500">{pet.pengguna.no_hp || '-'}</p>
            </td>
            <td className="px-6 py-4">
                {pet.kebutuhan_khusus ? (
                    <span className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                        {pet.kebutuhan_khusus}
                    </span>
                ) : (
                    <span className="text-sm text-gray-600">-</span>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        title="Lihat Detail"
                        className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        title="Edit (Coming Soon)"
                        className="p-1.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Hapus Hewan"
                        className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
