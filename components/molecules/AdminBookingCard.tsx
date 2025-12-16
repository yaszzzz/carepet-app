'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Check, Clock, Calendar, User, PawPrint } from 'lucide-react';
import { updateBookingStatus } from '@/lib/actions/admin/booking';

interface AdminBookingCardProps {
    booking: {
        id_pemesanan: string;
        hewan: {
            nama_hewan: string;
            jenis: string;
            pengguna: {
                nama_pengguna: string;
                no_hp?: string | null;
            };
        };
        tgl_masuk: Date;
        tgl_keluar: Date;
        status: string;
        layanan: {
            nama_layanan: string;
        };
    };
}

export const AdminBookingCard = ({ booking }: AdminBookingCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateStatus = async (status: string) => {
        if (!confirm(`Ubah status menjadi ${status}?`)) return;

        setIsLoading(true);
        const result = await updateBookingStatus(booking.id_pemesanan, status);

        if (result?.success) {
            router.refresh();
        } else {
            alert('Gagal memperbarui status');
            setIsLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            Menunggu: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            Proses: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            Selesai: 'bg-green-500/10 text-green-500 border-green-500/20',
            Dibatalkan: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        const style = styles[status as keyof typeof styles] || styles.Menunggu;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex justify-between items-start mb-4">
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
                {booking.status === 'Menunggu' && (
                    <>
                        <button
                            onClick={() => handleUpdateStatus('Proses')}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            <CheckCircle size={16} />
                            Terima
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('Dibatalkan')}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            <XCircle size={16} />
                            Tolak
                        </button>
                    </>
                )}

                {booking.status === 'Proses' && (
                    <button
                        onClick={() => handleUpdateStatus('Selesai')} // Assuming 'Selesai' is the complete state
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        <Check size={16} />
                        Selesaikan
                    </button>
                )}

                {['Selesai', 'Dibatalkan'].includes(booking.status) && (
                    <div className="w-full text-center text-gray-500 text-sm italic py-2">
                        Tidak ada aksi tersedia
                    </div>
                )}
            </div>
        </div>
    );
};
