import { Shield, Heart, PawPrint } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background dengan gradient dari palette */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#31694E]/5 rounded-full translate-y-48 -translate-x-48"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F0E491] text-[#31694E] px-4 py-2 rounded-full mb-6">
              <PawPrint className="h-4 w-4" />
              <span className="text-sm font-semibold">#1 Pet Care di Indonesia</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-[#31694E]">Perawatan</span>{' '}
              <span className="text-[#658C58]">Hewan</span>{' '}
              <span className="text-[#BBC863]">Terbaik</span>
            </h1>

            <p className="text-lg text-gray-200 mb-8">
              Layanan grooming, kesehatan, dan penitipan hewan profesional dengan{' '}
              <span className="text-[#658C58] font-semibold">perhatian penuh kasih sayang</span>.
              Kami hadir untuk teman berbulu Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/login"
                className="bg-[#658C58] text-white px-8 py-4 rounded-xl hover:bg-[#31694E] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
              >
                Booking Sekarang
              </Link>
              <Link
                href="/login"
                className="border-2 border-[#BBC863] text-white px-8 py-4 rounded-xl hover:bg-[#F0E491]/20 transition-all duration-300 font-semibold text-lg text-center"
              >
                Lihat Layanan
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#BBC863]"></div>
                  <span className="text-2xl font-bold text-[#31694E]">5,000+</span>
                </div>
                <p className="text-gray-200">Hewan Terlayani</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#658C58]"></div>
                  <span className="text-2xl font-bold text-[#31694E]">98%</span>
                </div>
                <p className="text-gray-200">Kepuasan Klien</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F0E491]"></div>
                  <span className="text-2xl font-bold text-[#31694E]">24/7</span>
                </div>
                <p className="text-gray-200">Layanan Darurat</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#BBC863] via-[#658C58] to-[#31694E] flex items-center justify-center">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#F0E491]"></div>
                  <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#F0E491]"></div>
                </div>

                {/* Hero Content */}
                <div className="relative text-center text-white p-8">
                  <div className="mb-6">
                    <Heart className="h-24 w-24 mx-auto text-white/90" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Rumah Kedua</h3>
                  <p className="text-white/80">Untuk Hewan Kesayangan Anda</p>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#F0E491]/20">
                  <Shield className="h-8 w-8 text-[#658C58]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Terpercaya</h3>
                  <p className="text-sm text-gray-600">100% aman & terjamin</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#31694E]/10">
                  <svg className="h-8 w-8 text-[#31694E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Bersertifikat</h3>
                  <p className="text-sm text-gray-600">Profesional berpengalaman</p>
                </div>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -bottom-6 right-10 flex gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`w-3 h-3 rounded-full ${dot === 2 ? 'bg-[#658C58]' : 'bg-[#F0E491]'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;