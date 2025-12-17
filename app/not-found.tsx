import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-9xl font-bold text-[#BBC863]">404</h1>
            <h2 className="text-3xl font-bold text-[#31694E] mt-4 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-600 text-center max-w-md mb-8">
                Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>

            <Link
                href="/"
                className="px-8 py-3 bg-[#658C58] text-white rounded-xl hover:bg-[#31694E] transition-colors"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
}
