// app/dashboard/services/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import AddServiceForm from '@/components/AddServiceForm';

export default async function ServicesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login.</div>;
  }
  
  const userId = user.id;

  // Ambil semua layanan milik pengguna ini
  const services = await prisma.service.findMany({
    where: { userId: userId },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Manajemen Layanan ({services.length})</h1>
      
      {/* Layout 2 Kolom: Formulir (Kiri) dan Daftar (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulir (KIRI - 1/3) */}
        <div className="lg:col-span-1">
            <AddServiceForm />
        </div>

        {/* Daftar Layanan (KANAN - 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Daftar Layanan yang Tersedia</h2>
          
          {services.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Anda belum mendefinisikan layanan apapun.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
                {services.map((service) => (
                    <li key={service.id} className="flex justify-between items-center py-4">
                        <div>
                            <p className="font-semibold text-gray-800">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className="text-lg font-bold text-indigo-600">
                            Rp{service.basePrice.toLocaleString('id-ID')}
                        </div>
                    </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}