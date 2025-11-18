// app/dashboard/clients/page.
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import AddClientForm from '@/components/AddClientForm'; // Komponen Form (1/3 Kolom)
import ClientTable from '@/components/ClientTable';   // Komponen Tabel (2/3 Kolom)

// Ini adalah Server Component (Async Function)
export default async function ClientsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Pengecekan Keamanan (RLS)
  if (!user) {
    // Di lingkungan nyata, ini akan mengarah ke halaman login yang lebih ramah
    return <div className="p-10 text-center text-red-600">Akses Ditolak. Silakan login untuk melihat daftar klien.</div>;
  }
  
  const userId = user.id;

  // 2. Pengambilan Data Klien menggunakan Prisma
  const clients = await prisma.client.findMany({
    where: { userId: userId },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Render Layout dan Komponen
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Klien ({clients.length})</h1>
        {/* Tombol yang dihapus karena form sudah tampil di kolom kiri */}
      </div>

      {/* Layout 2 Kolom: Formulir (Kiri) dan Tabel (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulir di Kolom 1 (KIRI - 1/3) */}
        <div className="lg:col-span-1">
            <AddClientForm />
        </div>

        {/* Tabel di Kolom 2 (KANAN - 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          {clients.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Anda belum memiliki data klien. Gunakan formulir di samping untuk memulai.
            </p>
          ) : (
            <ClientTable data={clients} /> 
          )}
        </div>
      </div>
    </div>
  );
}