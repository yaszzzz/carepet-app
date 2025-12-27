'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { UploadProgress } from '@/components/atoms/UploadProgress';
import { processPayment } from '@/lib/actions/payment';
import { Clock, Upload, Copy, CheckCircle, QrCode, Shield, Building2, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PaymentInterfaceProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any;
    totalAmount: number;
    onSuccess?: () => void;
}

export const PaymentInterface = ({ booking, totalAmount, onSuccess }: PaymentInterfaceProps) => {
    const router = useRouter();
    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer'>('qris');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Disalin ke clipboard');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }

            setSelectedFile(file);
            toast.success('Bukti pembayaran berhasil dipilih');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Mohon upload bukti pembayaran');
            return;
        }

        setIsLoading(true);
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 15;
            });
        }, 150);

        try {
            const formData = new FormData();
            formData.append('bookingId', booking.id_pemesanan);
            formData.append('amount', totalAmount.toString());
            formData.append('methodType', paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank');
            formData.append('paymentProvider', paymentMethod === 'qris' ? 'GOPAY/OVO/DANA' : 'BCA');
            formData.append('paymentProof', selectedFile);

            await processPayment(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setIsUploading(false);

            // Show success modal instead of immediate redirect
            setShowSuccessModal(true);
            toast.success('Pembayaran berhasil dikirim!', { duration: 5000 });

            // Delayed redirect to let user see success message
            setTimeout(() => {
                if (onSuccess) onSuccess();
                router.push('/dashboard/history');
            }, 3000);

        } catch (err: any) {
            clearInterval(progressInterval);
            setIsUploading(false);
            setUploadProgress(0);
            console.error(err);
            toast.error(err.message || 'Gagal mengirim pembayaran');
        } finally {
            setIsLoading(false);
        }
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

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'qris'
                        ? 'border-[#658C58] bg-[#658C58]/10 text-[#658C58]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                >
                    <QrCode size={24} />
                    <span className="font-medium text-sm">QRIS</span>
                </button>
                <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'transfer'
                        ? 'border-[#658C58] bg-[#658C58]/10 text-[#658C58]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                >
                    <Building2 size={24} />
                    <span className="font-medium text-sm">Transfer Bank</span>
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                {paymentMethod === 'qris' ? (
                    <div className="text-center space-y-4">
                        <div className="bg-white p-4 rounded-lg inline-block border border-gray-200">
                            {/* Placeholder QR */}
                            <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-white">
                                <QrCode size={64} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Scan QR Code di atas menggunakan aplikasi e-wallet Anda (GoPay, OVO, Dana, ShopeePay)</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-white p-2 rounded border border-gray-200 w-16 h-10 flex items-center justify-center font-bold text-blue-800">
                                BCA
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-medium">Nomor Rekening</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-lg font-bold text-gray-900">8800123456</p>
                                    <button onClick={() => handleCopy('8800123456')} className="text-gray-400 hover:text-gray-600">
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600">a.n PT CarePet Indonesia</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Proof */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Upload Bukti Pembayaran</label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${selectedFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {selectedFile ? (
                            <div className="flex flex-col items-center text-emerald-600">
                                <CheckCircle size={32} className="mb-2" />
                                <span className="font-medium text-sm">{selectedFile.name}</span>
                                <span className="text-xs mt-1">Klik untuk mengganti</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <Upload size={32} className="mb-2" />
                                <span className="font-medium text-sm">Klik untuk upload bukti bayar</span>
                                <span className="text-xs mt-1">Format: JPG, PNG (Max 2MB)</span>
                            </div>
                        )}
                    </div>

                    {/* Upload Progress */}
                    <UploadProgress
                        progress={uploadProgress}
                        isUploading={isUploading}
                        fileName={selectedFile?.name}
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600">Total Pembayaran</span>
                        <span className="text-2xl font-bold text-[#658C58]">
                            Rp {totalAmount.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#658C58] hover:bg-[#31694E] text-white py-6 text-lg shadow-lg shadow-green-900/20"
                        isLoading={isLoading}
                        disabled={isLoading || !selectedFile}
                    >
                        {isLoading ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Shield size={12} />
                    Pembayaran akan diverifikasi oleh Admin dalam 1x24 jam
                </p>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PartyPopper className="text-emerald-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Pembayaran Berhasil!</h2>
                        <p className="text-gray-600 mb-6">
                            Pembayaran Anda telah berhasil dikirim dan sedang diproses.
                            Admin akan memverifikasi pembayaran Anda dalam 1x24 jam.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-[#658C58] rounded-full animate-pulse" />
                            <span>Mengalihkan ke halaman riwayat...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
