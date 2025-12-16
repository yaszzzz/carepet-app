import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button/Button';
import { H1, H2, H3, P, Lead } from '@/components/atoms/Typography';
import { FeatureItem } from '@/components/molecules/FeatureItem';
import { TeamCard } from '@/components/molecules/TeamCard';
import { StatsCard } from '@/components/molecules/StatsCard';

// ============ ICON COMPONENTS (DI LUAR RENDER) ============
const HeartIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.803a4 4 0 11-5.196-5.196 4 4 0 015.196 5.196z" />
  </svg>
);

const AwardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PawIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface AboutSectionProps {
  className?: string;
}

const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ className, ...props }, ref) => {

    // ============ DATA ARRAY (BOLEH DI DALAM RENDER) ============

    // Features data
    const features = [
      {
        icon: <HeartIcon />,
        title: 'Perawatan Penuh Kasih',
        description: 'Setiap hewan diperlakukan dengan kasih sayang dan perhatian penuh.',
        iconColor: '#658C58',
      },
      {
        icon: <ShieldIcon />,
        title: 'Profesional & Terpercaya',
        description: 'Staf bersertifikat dengan pengalaman bertahun-tahun.',
        iconColor: '#31694E',
      },
      {
        icon: <UsersIcon />,
        title: 'Komunitas Pecinta Hewan',
        description: 'Bergabung dengan ribuan pecinta hewan yang percaya pada kami.',
        iconColor: '#BBC863',
      },
      {
        icon: <AwardIcon />,
        title: 'Penghargaan & Pengakuan',
        description: 'Diakui sebagai penyedia layanan hewan terbaik.',
        iconColor: '#F0E491',
      },
    ];

    // Team members data
    const teamMembers = [
      {
        name: 'Dr. Sarah Wijaya',
        role: 'Dokter Hewan Utama',
        description: 'Spesialis bedah hewan dengan 10+ tahun pengalaman di bidang veteriner.',
        experience: '12 tahun',
        specialties: ['Bedah', 'Grooming', 'Nutrisi'],
      },
      {
        name: 'Budi Santoso',
        role: 'Ahli Grooming',
        description: 'Bersertifikat internasional dengan spesialisasi grooming anjing dan kucing.',
        experience: '8 tahun',
        specialties: ['Grooming', 'Styling', 'Perawatan Bulu'],
      },
      {
        name: 'Maya Indah',
        role: 'Perawat Hewan',
        description: 'Perawat hewan berpengalaman dengan sertifikasi perawatan intensif.',
        experience: '6 tahun',
        specialties: ['Perawatan', 'Rehabilitasi', 'Fisioterapi'],
      },
    ];

    // Stats data
    const stats = [
      {
        icon: <PawIcon />,
        value: '5,000+',
        label: 'Hewan Terlayani',
        description: 'Hewan peliharaan bahagia',
      },
      {
        icon: <UsersIcon />,
        value: '2,500+',
        label: 'Klien Puas',
        description: 'Pecinta hewan bergabung',
      },
      {
        icon: <AwardIcon />,
        value: '98%',
        label: 'Rating Positif',
        description: 'Kepuasan klien',
      },
      {
        icon: <ClockIcon />,
        value: '24/7',
        label: 'Layanan Darurat',
        description: 'Siap membantu kapan saja',
      },
    ];

    return (
      <section
        ref={ref}
        className={cn('relative w-full overflow-hidden py-16 md:py-24', className)}
        {...props}
      >
        {/* Background dengan gradient dari palette - SAMA SEPERTI HERO */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5" id="about"></div>

        {/* Decorative elements - SAMA SEPERTI HERO */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#31694E]/5 rounded-full translate-y-48 -translate-x-48"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 bg-[#F0E491] text-[#31694E] px-4 py-2 rounded-full text-sm font-semibold">
                Tentang Kami
              </span>
            </div>
            <H1 className="mb-6 ">
              <span className="text-[#31694E]">Merawat</span> dengan{' '}
              <span className="text-[#658C58]">Kasih Sayang</span>
            </H1>
            <Lead className="text-white mb-8">
              Sejak 2010, Care Pet telah menjadi rumah kedua untuk ribuan hewan peliharaan.
              Kami percaya setiap hewan layak mendapatkan perawatan terbaik dengan kasih sayang penuh.
            </Lead>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-[#658C58] text-white hover:bg-[#31694E] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Jadwalkan Konsultasi
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#BBC863] text-white hover:bg-[#F0E491]/20 transition-all duration-300"
              >
                Lihat Galeri
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 ">
            {stats.map((stat, index) => (
              <div key={index}>
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <H2 className="mb-4 text-[#BBC863]">
                Mengapa Memilih Kami?
              </H2>
              <P className="text-gray-200 max-w-2xl mx-auto">
                Kombinasi keahlian profesional dan kasih sayang tulus membuat kami berbeda
              </P>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index}>
                  <FeatureItem {...feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <div>
                <H3 className="mb-4 text-[#658C58]">
                  Misi Kami
                </H3>
                <P className="text-gray-200">
                  Memberikan layanan perawatan hewan terbaik dengan standar profesional
                  tertinggi, memastikan setiap hewan peliharaan mendapatkan perawatan
                  yang mereka butuhkan untuk hidup sehat dan bahagia.
                </P>
              </div>
              <ul className="space-y-3">
                {[
                  'Perawatan berbasis bukti ilmiah',
                  'Fasilitas bersih dan modern',
                  'Staf bersertifikat',
                  'Harga transparan',
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#BBC863] mr-3"></div>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <H3 className="mb-4 text-[#658C58]">
                  Visi Kami
                </H3>
                <P className="text-gray-200">
                  Menjadi pusat perawatan hewan terdepan di Indonesia yang diakui
                  secara internasional, menciptakan komunitas pecinta hewan yang
                  peduli dan berpengetahuan.
                </P>
              </div>
              <div
                className="rounded-xl p-6 border border-[#F0E491]"
                style={{ backgroundColor: 'rgba(240, 228, 145, 0.1)' }}
              >
                <blockquote
                  className="italic mb-4 text-gray-200"
                >
                  Hewan bukan hanya peliharaan, mereka adalah keluarga.
                  Perawatan mereka adalah komitmen seumur hidup.
                </blockquote>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: '#F0E491' }}
                  >
                    <UsersIcon />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-gray-200"
                    >
                      Care Pet Team
                    </p>
                    <p className="text-sm text-gray-400">Founding Principle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <H2 className="mb-4 text-[#31694E]">
                Tim Profesional Kami
              </H2>
              <P className="text-gray-200 max-w-2xl mx-auto">
                Bertemu dengan tim ahli yang siap merawat hewan kesayangan Anda
              </P>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index}>
                  <TeamCard {...member} />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div
            className="rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #658C58 0%, #31694E 100%)`
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white"></div>
            </div>

            <div className="relative z-10">
              <H2 className="mb-4">Siap Merawat Hewan Kesayangan Anda?</H2>
              <P className="mb-8 max-w-2xl mx-auto opacity-90">
                Bergabung dengan keluarga Care Pet dan dapatkan konsultasi gratis
                untuk pertama kalinya
              </P>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Booking Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }
);

AboutSection.displayName = 'AboutSection';

export { AboutSection };
export type { AboutSectionProps };