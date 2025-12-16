'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { updatePetAdmin } from '@/lib/actions/admin/pet';
import { useRouter } from 'next/navigation';

interface EditPetModalProps {
    pet: {
        id_hewan: string;
        nama_hewan: string;
        jenis: string;
        usia: number;
        kebutuhan_khusus?: string | null;
    };
    isOpen: boolean;
    onClose: () => void;
}

export const EditPetModal = ({ pet, isOpen, onClose }: EditPetModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_hewan: pet.nama_hewan,
        jenis: pet.jenis,
        usia: pet.usia,
        kebutuhan_khusus: pet.kebutuhan_khusus || ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updatePetAdmin(pet.id_hewan, {
            ...formData,
            usia: Number(formData.usia),
            kebutuhan_khusus: formData.kebutuhan_khusus || null
        });

        setIsLoading(false);

        if (result?.success) {
            onClose();
            router.refresh();
        } else {
            alert('Gagal mengupdate hewan');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Edit Hewan</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nama Hewan
                        </label>
                        <input
                            type="text"
                            value={formData.nama_hewan}
                            onChange={(e) => setFormData({ ...formData, nama_hewan: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Jenis
                            </label>
                            <select
                                value={formData.jenis}
                                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Kucing">Kucing</option>
                                <option value="Anjing">Anjing</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Usia (Tahun)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.usia}
                                onChange={(e) => setFormData({ ...formData, usia: parseInt(e.target.value) || 0 })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Kebutuhan Khusus
                        </label>
                        <textarea
                            value={formData.kebutuhan_khusus}
                            onChange={(e) => setFormData({ ...formData, kebutuhan_khusus: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                            placeholder="Kosongkan jika tidak ada"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
