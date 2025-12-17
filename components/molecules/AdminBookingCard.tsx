'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Check, Clock, Calendar, User, PawPrint, Edit } from 'lucide-react';
import { updateBookingStatus } from '@/lib/actions/admin/booking';
import { toast } from 'sonner';
import { AdminBookingStatusModal } from '../organisms/AdminBookingStatusModal';

export interface AdminBookingCardProps {
    booking: {
        id_pemesanan: string;
        hewan: {
            nama_hewan: string;
            jenis: string;
            pengguna: {
                nama_pengguna: string;
                no_hp?: string | null; // Allow null or undefined
            };
        };
        tgl_masuk: Date;
        tgl_keluar: Date;
        status: string;
        catatan?: string | null;
        layanan: {
            nama_layanan: string;
        };
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    // ... (keep existing StatusBadge)
    const styles = {
        'Menunggu Pembayaran': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        'Menunggu Konfirmasi': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'Lunas': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Proses': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Selesai': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        'Dibatalkan': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    const style = styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
};

export const AdminBookingCard = ({ booking }: AdminBookingCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdateStatus = (status: string) => {
        // ... (existing handleUpdateStatus logic)
        toast("Ubah status menjadi " + status + "?", {
            action: {
                label: "Ya",
                onClick: async () => {
                    setIsLoading(true);
                    const result = await updateBookingStatus(booking.id_pemesanan, status);

                    if (result?.success) {
                        toast.success("Status berhasil diperbarui");
                        router.refresh();
                    } else {
                        toast.error("Gagal memperbarui status");
                        setIsLoading(false);
                    }
                }
            },
            cancel: {
                label: "Batal",
                onClick: () => { }
            }
        });
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 relative group">
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-gray-700/50 hover:bg-indigo-500 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Edit Status & Kondisi"
            >
                <Edit size={16} />
            </button>
            <div className="flex justify-between items-start mb-4 pr-10">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-2xl">
                        {booking.hewan.jenis === 'Kucing' ? '🐱' : '🐶'}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{booking.hewan.nama_hewan}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <User size={14} />
                            <span>{booking.hewan.pengguna.nama_pengguna}</span>
                            {booking.hewan.pengguna.no_hp && <span className="text-gray-600">• {booking.hewan.pengguna.no_hp}</span>}
                        </div>
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-750 p-3 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <Calendar size={14} />
                        <span>Check In</span>
                    </div>
                    <p className="text-white font-medium">
                        {new Date(booking.tgl_masuk).toLocaleDateString('id-ID')}
                    </p>
                </div>
                <div className="bg-gray-750 p-3 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <Calendar size={14} />
                        <span>Check Out</span>
                    </div>
                    <p className="text-white font-medium">
                        {new Date(booking.tgl_keluar).toLocaleDateString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 bg-gray-750 p-2 rounded-lg">
                <PawPrint size={14} />
                <span>Layanan: <span className="text-indigo-400 font-medium">{booking.layanan.nama_layanan}</span></span>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-700">
                {/* Actions based on Status */}
                {booking.status === 'Lunas' && (
                    <button
                        onClick={() => handleUpdateStatus('Proses')}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        <CheckCircle size={16} />
                        Check In / Proses
                    </button>
                )}

                {booking.status === 'Proses' && (
                    <button
                        onClick={() => handleUpdateStatus('Selesai')}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        <Check size={16} />
                        Selesaikan
                    </button>
                )}

                {['Menunggu Pembayaran', 'Menunggu Konfirmasi'].includes(booking.status) && (
                    <div className="w-full text-center text-yellow-500 text-sm italic py-2">
                        Menunggu Pembayaran/Konfirmasi
                    </div>
                )}

                {['Selesai', 'Dibatalkan'].includes(booking.status) && (
                    <div className="w-full text-center text-gray-500 text-sm italic py-2">
                        Selesai / Dibatalkan
                    </div>
                )}
            </div>

            <AdminBookingStatusModal
                bookingId={booking.id_pemesanan}
                currentStatus={booking.status}
                currentNotes={booking.catatan}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
