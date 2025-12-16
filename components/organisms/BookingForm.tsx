'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { createBooking } from '@/lib/actions/booking';
import { Calendar, AlertCircle } from 'lucide-react';

interface BookingFormProps {
    service: any;
    pets: any[];
}

export const BookingForm = ({ service, pets }: BookingFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError('');

        const result = await createBooking(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push('/dashboard/status');
            router.refresh();
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="id_layanan" value={service.id_layanan} />

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Pilih Hewan</label>
                    <select
                        name="id_hewan"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                        required
                    >
                        <option value="">Pilih Hewan Peliharaan</option>
                        {pets.map(pet => (
                            <option key={pet.id_hewan} value={pet.id_hewan}>
                                {pet.nama_hewan} ({pet.jenis})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tanggal Masuk"
                        name="tgl_masuk"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                        label="Tanggal Keluar"
                        name="tgl_keluar"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Layanan</span>
                        <span className="font-medium text-gray-900">{service.nama_layanan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Harga per Hari</span>
                        <span className="font-medium text-gray-900">Rp {service.harga.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 mt-2">
                        <p className="text-xs text-gray-500 italic">*Total biaya akan dikonfirmasi setelah pemesanan disetujui.</p>
                    </div>
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
                    Konfirmasi Booking
                </Button>
            </div>
        </form>
    );
};
