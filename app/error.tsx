'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terjadi Kesalahan!</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                Kami mohon maaf atas ketidaknyamanan ini. Silakan coba muat ulang halaman.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-2 bg-[#658C58] text-white rounded-lg hover:bg-[#31694E] transition-colors"
            >
                Coba Lagi
            </button>
        </div>
    );
}
