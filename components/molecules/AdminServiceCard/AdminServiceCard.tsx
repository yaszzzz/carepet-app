'use client';

import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { deleteService } from '@/lib/actions/admin/service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditServiceModal } from '../../organisms/EditServiceModal/EditServiceModal';
import { toast } from 'sonner';

interface AdminServiceCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
}

export const AdminServiceCard = ({ id, name, description, price }: AdminServiceCardProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        // ... (existing logic)
        toast("Hapus layanan " + name + "?", {
            // ... existing toast logic if you want to keep it consistent or use window.confirm as before?
            // The previous code used window.confirm. Let's stick to window.confirm or upgrade to Sonner.
            // Let's upgrade to Sonner for consistency.
            action: {
                label: 'Hapus',
                onClick: async () => {
                    setIsDeleting(true);
                    const result = await deleteService(id);
                    if (result?.success) {
                        toast.success('Layanan berhasil dihapus');
                        router.refresh();
                    } else {
                        toast.error(result?.error || 'Gagal menghapus layanan');
                        setIsDeleting(false);
                    }
                }
            },
            cancel: { label: 'Batal', onClick: () => { } }
        });
    };

    return (
        <>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                            title="Edit Layanan"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 disabled:opacity-50"
                            title="Hapus Layanan"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Harga</span>
                    <span className="text-lg font-bold text-emerald-400">
                        Rp {price.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>

            <EditServiceModal
                service={{ id, name, description, price }}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />
        </>
    );
};
