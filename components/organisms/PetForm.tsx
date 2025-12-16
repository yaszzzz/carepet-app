'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { addPet } from '@/lib/actions/pet';
import { Dog, Calendar, AlertCircle } from 'lucide-react';

export const PetForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError('');

        const result = await addPet(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            // Success
            router.push('/dashboard/pets');
            router.refresh();
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <Input
                    label="Nama Hewan"
                    name="nama_hewan"
                    placeholder="Contoh: Bruno"
                    leftIcon={<Dog size={18} />}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Jenis Hewan</label>
                        <select
                            name="jenis"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                            required
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Anjing">Anjing</option>
                            <option value="Kucing">Kucing</option>
                            <option value="Kelinci">Kelinci</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <Input
                        label="Usia (Tahun)"
                        name="usia"
                        type="number"
                        placeholder="Contoh: 3"
                        leftIcon={<Calendar size={18} />}
                        required
                        min={0}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Kebutuhan Khusus (Opsional)</label>
                    <textarea
                        name="kebutuhan_khusus"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Contoh: Alergi makanan tertentu, butuh obat harian..."
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    className="w-full bg-[#31694E] hover:bg-[#26533d] text-white"
                    isLoading={isLoading}
                >
                    Simpan Hewan
                </Button>
            </div>
        </form>
    );
};
