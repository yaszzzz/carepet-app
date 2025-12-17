export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#BBC863] border-t-[#31694E] rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">Loading Care Pet...</h2>
                <p className="text-gray-500">Mohon tunggu sebentar</p>
            </div>
        </div>
    );
}
