'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { addService } from '@/lib/actions/admin/service';
import { AlertCircle, ShoppingBag, DollarSign, FileText } from 'lucide-react';

export const AdminServiceForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError('');

        const result = await addService(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push('/admin/services');
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
                    label="Nama Layanan"
                    name="nama_layanan"
                    placeholder="Contoh: Premium Grooming"
                    leftIcon={<ShoppingBag size={18} />}
                    required
                />

                <Input
                    label="Harga (Rp)"
                    name="harga"
                    type="number"
                    placeholder="Contoh: 150000"
                    leftIcon={<DollarSign size={18} />}
                    required
                    min={0}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Deskripsi</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                            name="deskripsi"
                            rows={4}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Deskripsi detail layanan..."
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    isLoading={isLoading}
                >
                    Simpan Layanan
                </Button>
            </div>
        </form>
    );
};
