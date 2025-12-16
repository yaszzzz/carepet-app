'use client';

import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card/Card';
import { PawPrint, AlertCircle, Trash2 } from 'lucide-react';
import { deletePet } from '@/lib/actions/pet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PetCardProps {
    id: string;
    name: string;
    type: string;
    age: number;
    specialNeeds?: string | null;
}

export const PetCard = ({ id, name, type, age, specialNeeds }: PetCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus data hewan ini?')) return;

        setIsDeleting(true);
        const result = await deletePet(id);

        if (result?.success) {
            router.refresh();
        } else {
            alert('Gagal menghapus hewan');
            setIsDeleting(false);
        }
    };

    return (
        <Card hover shadow="sm" className="h-full relative group">
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 disabled:opacity-50"
                title="Hapus Hewan"
            >
                <Trash2 size={16} />
            </button>

            <CardContent className="p-6 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#BBC863] to-[#A3B055] flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <PawPrint size={32} />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{type} • {age} Tahun</p>

                    {specialNeeds ? (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 text-xs mt-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <p className="line-clamp-2">{specialNeeds}</p>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 mt-3 italic">
                            Tidak ada kebutuhan khusus
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
