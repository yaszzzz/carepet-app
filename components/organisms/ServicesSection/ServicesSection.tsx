"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button/Button';
import { H1, H2, P, Lead } from '@/components/atoms/Typography';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { Badge } from '@/components/atoms/Badge';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: 'grooming' | 'vet' | 'boarding' | 'training' | 'other';
  featured?: boolean;
  icon?: React.ReactNode;
  details?: string[];
}

export interface ServicesSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showFilter?: boolean;
  limit?: number;
  services?: Service[];
}

const ServicesSection = React.forwardRef<HTMLDivElement, ServicesSectionProps>(
  ({
    className,
    title = "Layanan Unggulan Kami",
    subtitle = "Berbagai layanan profesional untuk kebutuhan hewan kesayangan Anda",
    showFilter = true,
    limit,
    services: initialServices,
    ...props
  }, ref) => {

    // State untuk filter
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Data layanan default
    const defaultServices: Service[] = [
      {
        id: 1,
        title: "Grooming Lengkap",
        description: "Mandi, potong kuku, bersihkan telinga, sikat bulu, dan perawatan kulit lengkap untuk hewan kesayangan Anda.",
        price: "Rp 150.000",
        duration: "2 jam",
        category: "grooming",
        featured: true,
        icon: "🛁",
        details: ["Sampo khusus", "Conditioner", "Potong kuku", "Bersihkan telinga", "Sikat bulu"]
      },
      {
        id: 2,
        title: "Konsultasi Veteriner",
        description: "Pemeriksaan kesehatan lengkap oleh dokter hewan profesional. Termasuk diagnosa dan rekomendasi perawatan.",
        price: "Rp 200.000",
        duration: "1 jam",
        category: "vet",
        icon: "🏥",
        details: ["Pemeriksaan fisik", "Konsultasi nutrisi", "Rekomendasi vaksin", "Saran perawatan"]
      },
      {
        id: 3,
        title: "Penitipan Harian",
        description: "Penitipan hewan dengan pengawasan 24 jam, makanan premium, area bermain, dan laporan harian.",
        price: "Rp 100.000",
        duration: "24 jam",
        category: "boarding",
        featured: true,
        icon: "🏠",
        details: ["Pengawasan 24 jam", "Makanan premium", "Area bermain", "Laporan harian", "Foto update"]
      },
      {
        id: 4,
        title: "Training Dasar",
        description: "Pelatihan dasar untuk perilaku hewan: duduk, diam, datang, dan toilet training.",
        price: "Rp 300.000",
        duration: "3 jam",
        category: "training",
        icon: "🎓",
        details: ["Duduk & diam", "Toilet training", "Socialization", "Basic commands"]
      },
      {
        id: 5,
        title: "Home Visit Grooming",
        description: "Layanan grooming datang ke rumah. Cocok untuk hewan yang stres bepergian atau pemilik sibuk.",
        price: "Rp 250.000",
        duration: "1.5 jam",
        category: "grooming",
        icon: "🚗",
        details: ["Datang ke rumah", "Perlengkapan lengkap", "Sampo premium", "Potong kuku", "Bersihkan telinga"]
      },
      {
        id: 6,
        title: "Vaksinasi & Check-up",
        description: "Layanan vaksinasi rutin dan pemeriksaan kesehatan preventif untuk hewan peliharaan.",
        price: "Rp 180.000",
        duration: "45 menit",
        category: "vet",
        icon: "💉",
        details: ["Vaksinasi dasar", "Pemeriksaan fisik", "Konsultasi dokter", "Sertifikat vaksin"]
      },
      {
        id: 7,
        title: "Penitipan Liburan",
        description: "Paket penitipan khusus untuk liburan panjang dengan fasilitas premium dan perhatian ekstra.",
        price: "Rp 75.000/hari",
        duration: "Paket",
        category: "boarding",
        icon: "✈️",
        details: ["Fasilitas premium", "Mainan interaktif", "Laporan harian", "Foto & video update", "Playtime 3x sehari"]
      },
      {
        id: 8,
        title: "Spa & Relaksasi",
        description: "Perawatan spa khusus dengan aromaterapi, pijat relaksasi, dan perawatan bulu premium.",
        price: "Rp 350.000",
        duration: "3 jam",
        category: "grooming",
        icon: "💆‍♂️",
        details: ["Aromaterapi", "Pijat relaksasi", "Masker bulu", "Conditioning", "Blow dry special"]
      }
    ];

    // Gunakan services dari props atau default
    const services = initialServices || defaultServices;

    // Filter services berdasarkan kategori
    const filteredServices = activeCategory === 'all'
      ? services
      : services.filter(service => service.category === activeCategory);

    // Apply limit jika ada
    const displayedServices = limit
      ? filteredServices.slice(0, limit)
      : filteredServices;

    // Categories untuk filter
    const categories = [
      { id: 'all', label: 'Semua Layanan', count: services.length },
      { id: 'grooming', label: 'Grooming', count: services.filter(s => s.category === 'grooming').length },
      { id: 'vet', label: 'Kesehatan', count: services.filter(s => s.category === 'vet').length },
      { id: 'boarding', label: 'Penitipan', count: services.filter(s => s.category === 'boarding').length },
      { id: 'training', label: 'Training', count: services.filter(s => s.category === 'training').length },
    ];

    // Handler untuk booking
    const handleBook = (serviceTitle: string) => {
      alert(`Booking ${serviceTitle} - Akan diarahkan ke halaman booking`);
      // nanti bisa redirect ke /booking dengan service data
    };

    // Handler untuk learn more
    const handleLearnMore = (service: Service) => {
      alert(`Detail ${service.title}\n\n${service.details?.join('\n• ')}`);
    };

    return (
      <section
        ref={ref}
        className={cn('relative w-full overflow-hidden py-16 md:py-24', className)}
        {...props}
      >
        {/* Background dengan gradient - SAMA DENGAN SECTION LAIN */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5" id="services"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#31694E]/5 rounded-full translate-y-48 -translate-x-48"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4">
              <Badge className="bg-[#F0E491] text-[#31694E]">
                🐾 Layanan Profesional
              </Badge>
            </div>

            <H1 className="mb-4">
              <span className="text-[#31694E]">{title}</span>
            </H1>

            <Lead className="text-gray-200 mb-8">
              {subtitle}
            </Lead>
          </div>

          {/* Filter Categories */}
          {showFilter && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    activeCategory === category.id
                      ? 'bg-[#658C58] text-white shadow-lg'
                      : 'bg-white/80 text-[#31694E] hover:bg-[#F0E491]/30 border border-[#BBC863]/30'
                  )}
                >
                  {category.label}
                  <span className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs',
                    activeCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-[#F0E491]'
                  )}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                duration={service.duration}
                category={service.category}
                icon={service.icon}
                featured={service.featured}
                bookingHref="/login"
                onBook={() => handleBook(service.title)}
                onLearnMore={() => handleLearnMore(service)}
              />
            ))}
          </div>

          {/* Show More / Less Logic */}
          {limit && filteredServices.length > limit && (
            <div className="text-center mb-12">
              <Button
                variant="outline"
                style={{
                  borderColor: '#BBC863',
                  color: '#31694E',
                }}
                className="hover:bg-[#F0E491]/20"
              >
                Lihat {filteredServices.length - limit} Layanan Lainnya
              </Button>
            </div>
          )}

          {/* Stats & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#F0E491]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#F0E491]/20">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#31694E] mb-1">Garansi Kepuasan</h3>
                  <p className="text-sm text-gray-600">100% uang kembali jika tidak puas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#BBC863]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#BBC863]/20">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#31694E] mb-1">Profesional Bersertifikat</h3>
                  <p className="text-sm text-gray-600">Staf berpengalaman & terlatih</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#658C58]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#658C58]/20">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#31694E] mb-1">Fasilitas Modern</h3>
                  <p className="text-sm text-gray-600">Peralatan terbaru & steril</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}

        </div>
      </section>
    );
  }
);

ServicesSection.displayName = 'ServicesSection';

export { ServicesSection };