'use client';

import { H2, Lead, P } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const TeamSection = () => {
    const team = [
        {
            name: "Dr. Sarah Johnson",
            role: "Kepala Dokter Hewan",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
            bio: "Berpengalaman lebih dari 10 tahun menangani kesehatan hewan kecil."
        },
        {
            name: "Michael Chen",
            role: "Senior Groomer",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
            bio: "Spesialis styling dan perawatan bulu dengan sertifikasi internasional."
        },
        {
            name: "Jessica Pratiwi",
            role: "Pet Trainer",
            image: "https://images.unsplash.com/photo-1580518337843-f959e992563b?auto=format&fit=crop&q=80&w=800",
            bio: "Ahli perilaku hewan yang sabar dan penuh kasih sayang."
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="bg-[#658C58] text-white mb-4">
                        👨‍⚕️ Tim Kami
                    </Badge>
                    <H2 className="mb-4 text-[#31694E]">Profesional & Terpercaya</H2>
                    <Lead className="text-gray-200">
                        Ditemani oleh para ahli yang berdedikasi tinggi untuk kesehatan dan kebahagiaan hewan Anda.
                    </Lead>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8 text-center">
                                <h3 className="text-xl font-bold text-[#31694E] mb-1">{member.name}</h3>
                                <p className="text-[#658C58] font-medium mb-4">{member.role}</p>
                                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-[#F0E491] hover:text-[#31694E] transition-colors">
                                        <Instagram size={18} />
                                    </button>
                                    <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-[#F0E491] hover:text-[#31694E] transition-colors">
                                        <Facebook size={18} />
                                    </button>
                                    <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-[#F0E491] hover:text-[#31694E] transition-colors">
                                        <Twitter size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
