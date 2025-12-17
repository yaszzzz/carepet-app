'use client';

import { useState } from 'react';
import { X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { verifyPayment } from '@/lib/actions/admin/payment';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AdminPaymentDetailModalProps {
    payment: {
        id_pembayaran: string;
        jumlah_bayar: number;
        metode: string;
        bukti_bayar: string | null;
        tanggal_bayar: Date;
        pemesanan: {
            id_pemesanan: string;
            status: string;
            hewan: {
                nama_hewan: string;
                pengguna: {
                    nama_pengguna: string;
                }
            }
        }
    };
    isOpen: boolean;
    onClose: () => void;
}

export const AdminPaymentDetailModal = ({ payment, isOpen, onClose }: AdminPaymentDetailModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerify = async () => {
        setIsLoading(true);
        const result = await verifyPayment(payment.id_pembayaran);

        if (result?.success) {
            toast.success('Pembayaran diverifikasi');
            router.refresh();
            onClose();
        } else {
            toast.error(result?.error || 'Gagal verifikasi pembayaran');
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/50">
                    <h2 className="text-xl font-bold text-white">Detail Pembayaran</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Payment Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">ID Transaksi</p>
                            <p className="text-white font-mono">{payment.id_pembayaran}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Pengguna</p>
                            <p className="text-white">{payment.pemesanan.hewan.pengguna.nama_pengguna}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Jumlah</p>
                            <p className="text-emerald-400 font-bold text-lg">Rp {payment.jumlah_bayar.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Metode</p>
                            <span className="inline-block px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 mt-1">{payment.metode}</span>
                        </div>
                    </div>

                    {/* Proof of Payment */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-300">Bukti Pembayaran</h3>
                        <div className="bg-gray-900 rounded-lg p-2 border border-gray-700 min-h-[200px] flex items-center justify-center">
                            {payment.bukti_bayar ? (
                                <img
                                    src={payment.bukti_bayar}
                                    alt="Bukti Pembayaran"
                                    className="max-w-full rounded"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada bukti pembayaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                        Tutup
                    </button>
                    {payment.pemesanan.status === 'Menunggu Pembayaran' || payment.pemesanan.status === 'Menunggu Konfirmasi' ? (
                        <button
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 font-medium"
                        >
                            <CheckCircle size={18} />
                            {isLoading ? 'Memproses...' : 'Terima Pembayaran'}
                        </button>
                    ) : (
                        <div className="px-4 py-2 rounded-lg bg-gray-800 text-gray-500 border border-gray-700 text-sm flex items-center">
                            Status: {payment.pemesanan.status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
