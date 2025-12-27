'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { createBooking } from '@/lib/actions/booking';
import { Calendar, AlertCircle } from 'lucide-react';

interface BookingFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pets: any[];
}

import { PaymentInterface } from '../PaymentInterface/PaymentInterface';

export const BookingForm = ({ service, pets }: BookingFormProps) => {
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'payment'>('form');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [createdBooking, setCreatedBooking] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states for live update
    const [selectedPetId, setSelectedPetId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    // Derived state
    const selectedPet = pets.find(p => p.id_hewan === selectedPetId);

    let duration = 0;
    let totalPrice = 0;

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Reset hours to ensure clean day calculation (ignoring timezones for simplicity in this context)
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end >= start) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // If same day (diff 0), it counts as 1 day? Or if user wants to checkout same day.
            // Usually boarding is per night. But if user requests "Hari ini masuk hari ini keluar", that's Day Care (1 day).
            if (duration === 0) duration = 1;
            totalPrice = duration * service.harga;
        } else {
            // Invalid range (End before Start handled by min attribute, but safe guard here)
            duration = 0;
            totalPrice = 0;
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError('');

        const result = await createBooking(formData);

        if (result.success && result.booking) {
            // Move to Payment Step
            setCreatedBooking(result.booking);
            setStep('payment');
            setIsLoading(false);
        } else {
            setError(result.error || 'Gagal membuat booking');
            setIsLoading(false);
        }
    };

    if (step === 'payment' && createdBooking) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Pembayaran</h2>
                    <p className="text-gray-500">Selesaikan pembayaran untuk memproses booking Anda.</p>
                </div>
                <PaymentInterface
                    booking={createdBooking}
                    totalAmount={totalPrice}
                />
            </div>
        );
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="id_layanan" value={service.id_layanan} />

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Inputs */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Pilih Hewan</label>
                            <select
                                name="id_hewan"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-gray-600"
                                required
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                            >
                                <option value="">-- pilih hewan --</option>
                                {pets.map(pet => (
                                    <option key={pet.id_hewan} value={pet.id_hewan}>
                                        {pet.nama_hewan} ({pet.jenis})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Layanan is Read-Only/Hidden/Implicit as requested */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Layanan</label>
                            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                                {service.nama_layanan}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tanggal Masuk</label>
                            <input
                                type="date"
                                name="tgl_masuk"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-600"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    // Automatically reset end date if it becomes invalid (less than start date)
                                    if (endDate && new Date(endDate) < new Date(e.target.value)) {
                                        setEndDate('');
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tanggal Keluar</label>
                            <input
                                type="date"
                                name="tgl_keluar"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-600"
                                required
                                min={startDate || new Date().toISOString().split('T')[0]} // Allow same day as start date
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Kebutuhan Khusus</label>
                            <textarea
                                name="catatan"
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-600 "
                                placeholder="Contoh: alergi makanan, harus makan wetfood, dll..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Confirmation Summary */}
                <div className="lg:pl-8 lg:border-l lg:border-gray-200">
                    <h3 className="font-bold text-xl text-gray-900 mb-6">Detail Pesanan</h3>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6 border border-gray-200">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Hewan:</span>
                                <span className="text-gray-600">{selectedPet ? `${selectedPet.nama_hewan} (${selectedPet.jenis})` : '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Layanan:</span>
                                <span className="text-gray-600">{service.nama_layanan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Tanggal Masuk:</span>
                                <span className="text-gray-600">{startDate || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Tanggal Keluar:</span>
                                <span className="text-gray-600">{endDate || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Durasi:</span>
                                <span className="text-gray-600">{duration > 0 ? `${duration} Hari` : '-'}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <span className="font-medium text-gray-900 block mb-1">Kebutuhan Khusus:</span>
                                <p className="text-gray-600 italic text-xs">{notes || 'Tidak ada'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-900">Total Bayar:</span>
                                <span className="font-bold text-xl text-[#31694E]">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-black hover:bg-black/80 text-white py-6 rounded-lg text-lg font-medium"
                        isLoading={isLoading}
                        disabled={isLoading || !selectedPetId || !startDate || !endDate}
                    >
                        Lanjut ke Pembayaran
                    </Button>
                </div>
            </div>
        </form>
    );
};
