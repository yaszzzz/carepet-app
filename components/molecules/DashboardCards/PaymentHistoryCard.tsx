'use client';

import { CreditCard, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import Link from 'next/link';

interface PaymentHistoryCardProps {
    count?: number;
}

export const PaymentHistoryCard = ({ count = 0 }: PaymentHistoryCardProps) => {
    return (
        <Link href="/dashboard/payments">
            <Card hover shadow="lg" className="h-full group cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#31694E] to-[#1a3a2a] text-white shadow-lg group-hover:scale-105 transition-transform">
                                <CreditCard size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Riwayat Pembayaran</h3>
                                <p className="text-sm text-gray-500">Lihat transaksi dan invoice</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-2xl font-bold text-[#31694E]">{count}</p>
                                <p className="text-xs text-gray-500">Transaksi</p>
                            </div>
                            <ChevronRight size={24} className="text-gray-400 group-hover:text-[#658C58] group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
