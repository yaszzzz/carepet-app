'use client';

import { motion } from 'framer-motion';

interface UploadProgressProps {
    progress: number;
    isUploading: boolean;
    fileName?: string;
}

export const UploadProgress = ({ progress, isUploading, fileName }: UploadProgressProps) => {
    if (!isUploading && progress === 0) return null;

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="truncate max-w-[200px]">
                    {fileName || 'Uploading...'}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`h-full rounded-full ${progress === 100
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-[#658C58] to-[#A3C9A8]'
                        }`}
                />
            </div>
            {progress === 100 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-600 font-medium"
                >
                    ✓ Upload selesai
                </motion.p>
            )}
        </div>
    );
};
