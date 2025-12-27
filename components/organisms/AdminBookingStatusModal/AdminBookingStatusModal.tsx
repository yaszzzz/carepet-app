'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { updateBookingStatus } from '@/lib/actions/admin/booking';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AdminBookingStatusModalProps {
    bookingId: string;
    currentStatus: string;
    currentNotes?: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const AdminBookingStatusModal = ({ bookingId, currentStatus, currentNotes, isOpen, onClose }: AdminBookingStatusModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const [notes, setNotes] = useState(currentNotes || '');
    const [photo, setPhoto] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('id_pemesanan', bookingId);
        formData.append('status', status);
        if (notes) formData.append('notes', notes);
        if (photo) formData.append('photo', photo);

        // Call the server action with formData
        const result = await updateBookingStatus(formData);

        if (result?.success) {
            toast.success('Status berhasil diperbarui');
            router.refresh();
            onClose();
        } else {
            toast.error(result?.error || 'Gagal memperbarui status');
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Update Status & Kondisi</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                            <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                            <option value="Lunas">Lunas (Pembayaran Diterima)</option>
                            <option value="Proses">Proses (Check-in)</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Kondisi / Catatan Hewan
                            <span className="text-xs text-gray-500 ml-2">(Opsional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
                            placeholder="Contoh: Hewan sehat, makan lahap, sudah dimandikan..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Foto Kondisi Terkini
                            <span className="text-xs text-gray-500 ml-2">(Opsional)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-indigo-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
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
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <Save size={18} />
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
