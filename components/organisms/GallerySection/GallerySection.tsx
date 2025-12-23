'use client';

import { H2, Lead } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';

export const GallerySection = () => {
    const images = [
        {
            src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
            alt: "Happy Dog Run"
        },
        {
            src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
            alt: "Cat Portrait"
        },
        {
            src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800",
            alt: "Grooming Session"
        },
        {
            src: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800",
            alt: "Pet Playing"
        },
        {
            src: "https://images.unsplash.com/photo-1597843786271-10512642ce7b?auto=format&fit=crop&q=80&w=800",
            alt: "Veterinary Care"
        },
        {
            src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800",
            alt: "Dog Walk"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="bg-[#BBC863] text-[#31694E] mb-4">
                        📸 Galeri Kami
                    </Badge>
                    <H2 className="mb-4 text-[#31694E]">Momen Bahagia</H2>
                    <Lead className="text-gray-200">
                        Intip keseruan dan kenyamanan hewan-hewan kesayangan di Care Pet.
                    </Lead>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500 z-10" />
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
