'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { processPayment } from '@/lib/actions/payment';
import { Clock, Upload, Copy, CheckCircle, Smartphone, CreditCard, QrCode, Shield } from 'lucide-react';

interface PaymentInterfaceProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any;
    totalAmount: number;
    onSuccess?: () => void;
}

export const PaymentInterface = ({ booking, totalAmount, onSuccess }: PaymentInterfaceProps) => {
    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const [paymentToken, setPaymentToken] = useState<string | null>(null);

    // Initial Token Generation
    useEffect(() => {
        // In a real app, we might generate token immediately or on button click
    }, []);

    const handlePayNow = async () => {
        setIsLoading(true);
        // 1. Get Token
        import('@/lib/actions/payment').then(async (mod) => {
            const result = await mod.createPaymentToken(booking.id_pemesanan);
            if (result.success && result.token) {
                setPaymentToken(result.token);
                // 2. Simulate Midtrans Popup
                const confirm = window.confirm(`[MIDTRANS STUB]\n\nTagihan: Rp ${totalAmount.toLocaleString('id-ID')}\nVirtual Account: BCA 8800${booking.id_pemesanan}\n\nKlik OK untuk "Bayar Sekarang" (Simulasi Sukses)`);

                if (confirm) {
                    // 3. Confirm Payment
                    await mod.confirmPayment(booking.id_pemesanan, 'Midtrans Simulator');
                    if (onSuccess) onSuccess();
                }
            } else {
                alert('Gagal membuat transaksi');
            }
            setIsLoading(false);
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Timer Section */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock className="text-orange-500" />
                    <div>
                        <p className="text-sm text-gray-600">Selesaikan pembayaran dalam</p>
                        <p className="font-bold text-orange-600 text-lg">{formatTime(timeLeft)}</p>
                    </div>
                </div>
                <div className="text-xs text-orange-400 font-medium">Jatuh tempo besok</div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center py-4 border-y border-dashed border-gray-200">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-[#658C58]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                </span>
            </div>

            {/* Midtrans Stub Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4">
                <div className="bg-white p-3 rounded-lg mx-auto w-max shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_bca.jpg/1200px-Logo_bca.jpg" alt="BCA" className="h-8 object-contain" />
                    {/* Placeholder logos */}
                </div>
                <p className="text-gray-700 font-medium">Payment Gateway Integration</p>
                <p className="text-sm text-gray-500 border-t border-blue-200 pt-3">
                    Klik tombol di bawah untuk membuka popup pembayaran (Midtrans Simulator)
                </p>
            </div>

            <Button
                onClick={handlePayNow}
                className="w-full bg-[#658C58] hover:bg-[#31694E] text-white py-6 text-lg shadow-lg shadow-green-900/20"
                isLoading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Memuat Gateway...' : 'Bayar Sekarang (Midtrans)'}
            </Button>

            <div className="text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Shield size={12} />
                    Pembayaran aman & terverifikasi otomatis
                </p>
            </div>
        </div>
    );
};
