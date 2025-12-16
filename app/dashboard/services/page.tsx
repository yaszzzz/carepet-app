import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { ServiceCard } from '@/components/molecules/ServiceCard/ServiceCard';
import { ShoppingBag } from 'lucide-react';

export default async function ServicesPage() {
    const services = await prisma.layanan.findMany();

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Layanan Kami</h1>
                <p className="text-gray-500 mt-1">Pilih layanan terbaik untuk hewan kesayangan Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id_layanan}
                        title={service.nama_layanan}
                        price={`Rp ${service.harga.toLocaleString('id-ID')}`}
                        description={service.deskripsi}
                        duration="1 Hari" // Default duration
                        category="other" // Default category
                        onBook={() => { }} // Placeholder
                        onLearnMore={() => { }} // Placeholder
                    />
                ))}
            </div>
        </DashboardLayout>
    );
}
