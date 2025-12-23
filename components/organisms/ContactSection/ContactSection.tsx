'use client';

import { H2, Lead } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-[#F0E491]/20 via-[#BBC863]/10 to-[#658C58]/5 text-white" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <Badge className="bg-[#F0E491] text-[#31694E] mb-4">
                            📞 Hubungi Kami
                        </Badge>
                        <H2 className="mb-6 text-[#31694E]">Kami Siap Membantu</H2>
                        <Lead className="text-gray-200 mb-8">
                            Punya pertanyaan seputar layanan kami? Jangan ragu untuk menghubungi kami atau datang langsung ke lokasi.
                        </Lead>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F0E491]/20 rounded-xl text-[#658C58]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-500">Lokasi</h4>
                                    <p className="text-gray-200">Jl. Pet Lover No. 88, Jakarta Selatan</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F0E491]/20 rounded-xl text-[#658C58]">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-500">Telepon / WhatsApp</h4>
                                    <p className="text-gray-200">+62 812 3456 7890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F0E491]/20 rounded-xl text-[#658C58]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-500">Email</h4>
                                    <p className="text-gray-200">hello@carepet.id</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F0E491]/20 rounded-xl text-[#658C58]">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-500">Jam Operasional</h4>
                                    <p className="text-gray-200">Senin - Minggu: 08.00 - 20.00 WIB</p>
                                </div>
                            </div>
                        </div>

                        <Button variant="primary" className="py-3 px-8 text-lg w-full sm:w-auto">
                            Chat via WhatsApp
                        </Button>
                    </div>

                    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.290564639918!2d106.80004907499039!3d-6.225367693762699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d3f079737%3A0xb14d025114771e31!2sSudirman%20Central%20Business%20District!5e0!3m2!1sen!2sid!4v1709627960336!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};
