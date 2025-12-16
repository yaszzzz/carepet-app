'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { processPayment } from '@/lib/actions/payment';
import { Clock, Upload, Copy, CheckCircle, Smartphone, CreditCard, QrCode } from 'lucide-react';

interface PaymentInterfaceProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any;
    totalAmount: number;
    onSuccess?: () => void;
}

export const PaymentInterface = ({ booking, totalAmount, onSuccess }: PaymentInterfaceProps) => {
    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

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

    // Payment Methods Logic
    const [methodType, setMethodType] = useState<'bank' | 'ewallet' | 'qris'>('bank');
    const [selectedProvider, setSelectedProvider] = useState<string>('bca');

    // Mock Data
    const banks = [
        { id: 'bca', name: 'BCA', va: `8800${booking.id_pemesanan.replace(/\D/g, '').padEnd(8, '0')}`, color: 'bg-blue-600' },
        { id: 'mandiri', name: 'Mandiri', va: `8900${booking.id_pemesanan.replace(/\D/g, '').padEnd(8, '0')}`, color: 'bg-blue-800' },
        { id: 'bri', name: 'BRI', va: `8700${booking.id_pemesanan.replace(/\D/g, '').padEnd(8, '0')}`, color: 'bg-blue-500' },
        { id: 'bni', name: 'BNI', va: `8600${booking.id_pemesanan.replace(/\D/g, '').padEnd(8, '0')}`, color: 'bg-orange-600' },
    ];

    const wallets = [
        { id: 'gopay', name: 'GoPay', number: '0812-3456-7890', color: 'bg-blue-500' },
        { id: 'ovo', name: 'OVO', number: '0812-3456-7890', color: 'bg-purple-600' },
        { id: 'dana', name: 'Dana', number: '0812-3456-7890', color: 'bg-blue-400' },
        { id: 'shopeepay', name: 'ShopeePay', number: '0812-3456-7890', color: 'bg-orange-500' },
    ];

    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // File Upload Logic
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        await processPayment(formData);
        if (onSuccess) onSuccess();
    };

    const currentBank = banks.find(b => b.id === selectedProvider);
    const currentWallet = wallets.find(w => w.id === selectedProvider);

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

            {/* Method Tabs */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => { setMethodType('bank'); setSelectedProvider('bca'); }}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${methodType === 'bank' ? 'border-[#658C58] bg-[#658C58]/5 text-[#31694E] shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <CreditCard size={20} />
                        <span className="text-xs font-medium">Transfer Bank</span>
                    </button>
                    <button
                        onClick={() => { setMethodType('ewallet'); setSelectedProvider('gopay'); }}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${methodType === 'ewallet' ? 'border-[#658C58] bg-[#658C58]/5 text-[#31694E] shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <Smartphone size={20} />
                        <span className="text-xs font-medium">E-Wallet</span>
                    </button>
                    <button
                        onClick={() => { setMethodType('qris'); setSelectedProvider('qris'); }}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${methodType === 'qris' ? 'border-[#658C58] bg-[#658C58]/5 text-[#31694E] shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <QrCode size={20} />
                        <span className="text-xs font-medium">QRIS</span>
                    </button>
                </div>
            </div>

            {/* Method Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                {methodType === 'bank' && (
                    <>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {banks.map(bank => (
                                <button
                                    key={bank.id}
                                    onClick={() => setSelectedProvider(bank.id)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedProvider === bank.id ? 'bg-[#658C58] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {bank.name}
                                </button>
                            ))}
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Nomor Virtual Account ({currentBank?.name})</p>
                            <div className="flex justify-between items-center">
                                <p className="font-mono text-xl font-bold text-gray-800 spacing-wide">{currentBank?.va}</p>
                                <button onClick={() => handleCopy(currentBank?.va || '')} className="text-[#658C58]">
                                    {isCopied ? <CheckCircle size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {methodType === 'ewallet' && (
                    <>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {wallets.map(wallet => (
                                <button
                                    key={wallet.id}
                                    onClick={() => setSelectedProvider(wallet.id)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedProvider === wallet.id ? 'bg-[#658C58] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {wallet.name}
                                </button>
                            ))}
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                            <p className="text-sm text-gray-600 mb-2">Scan kode untuk membayar dengan {currentWallet?.name}</p>
                            <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center mb-2">
                                <QrCode size={64} className="text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500">Atau transfer manual ke: {currentWallet?.number}</p>
                        </div>
                    </>
                )}

                {methodType === 'qris' && (
                    <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
                        <div className="w-56 h-56 bg-white mx-auto border-2 border-gray-800 rounded-lg p-2 mb-4">
                            {/* Mock QRIS Pattern */}
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-bold tracking-widest">
                                QRIS POLDER
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800">Scan QRIS</p>
                        <p className="text-xs text-gray-500">Mendukung semua e-wallet dan mobile banking</p>
                    </div>
                )}
            </div>

            {/* Upload Section */}
            <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="bookingId" value={booking.id_pemesanan} />
                <input type="hidden" name="amount" value={totalAmount} />

                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Upload Bukti Pembayaran</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <input
                            type="file"
                            name="paymentProof"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required
                        />
                        <div className="flex flex-col items-center gap-2">
                            {file ? (
                                <>
                                    <div className="bg-[#658C58]/10 p-3 rounded-full text-[#658C58]">
                                        <CheckCircle size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{file.name}</span>
                                    <span className="text-xs text-green-600">Siap diupload</span>
                                </>
                            ) : (
                                <>
                                    <div className="bg-gray-100 p-3 rounded-full text-gray-400 group-hover:text-gray-600 transition-colors">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Klik untuk upload gambar</span>
                                    <span className="text-xs text-gray-400">JPG, PNG max 2MB</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#658C58] hover:bg-[#31694E] text-white py-6 text-lg"
                    isLoading={isLoading}
                    disabled={!file || isLoading}
                >
                    {isLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                </Button>
            </form>
        </div>
    );
};
