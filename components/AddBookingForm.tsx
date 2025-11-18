'use client';

import { useState } from 'react';
import { createBooking } from '@/actions/booking';
import Link from 'next/link'; // <--- Tambahkan import Link

// Tipe data yang diterima dari Server Component
interface Option {
    id: string;
    name: string;
}

// 1. BUAT INTERFACE SERVICE EKSPLISIT
interface Service extends Option {
    basePrice: number;
}

interface AddBookingFormProps {
    clients: Option[];
    // 2. GUNAKAN INTERFACE SERVICE EKSPLISIT
    services: Service[];
}


export default function AddBookingForm({ clients, services }: AddBookingFormProps) {
    const [status, setStatus] = useState<{ message: string, success: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedServicePrice, setSelectedServicePrice] = useState(0);

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      // 3. KARENA KITA MENGGUNAKAN ID SEBAGAI STRING DARI DROPDOWN,
      // PASTIKAN SERVICE DITEMUKAN BERDASARKAN STRING ID.
      const serviceId = e.target.value;
      const selectedService = services.find(s => s.id === serviceId);
      
      // Error Type: Property 'id' tidak ada di tipe services sebelum fix
      // Fix: Interface Service sekarang secara eksplisit mewarisi 'id'.
      setSelectedServicePrice(selectedService ? selectedService.basePrice : 0);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setStatus(null);

      const formData = new FormData(event.currentTarget);
      const bookingData = {
          clientId: formData.get('clientId') as string,
          serviceId: formData.get('serviceId') as string,
          title: formData.get('title') as string,
          date: formData.get('date') as string,
          location: formData.get('location') as string,
          price: formData.get('price') as string,
      };

      const result = await createBooking(bookingData);
      
      setStatus(result);
      setIsLoading(false);

      if (result.success) {
        event.currentTarget.reset();
        setSelectedServicePrice(0);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-yellow-50 rounded-2xl shadow-md">
        <h3 className="text-xl font-bold text-yellow-700 mb-4">Buat Pemesanan Baru</h3>
        
        {status && (
          <div className={`p-3 rounded-lg text-sm ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        {/* Field Klien (Dropdown) */}
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Pilih Klien</label>
          <select
            id="clientId"
            name="clientId"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading || clients.length === 0}
          >
            <option value="">-- Pilih Klien --</option>
            {/* NOTE: Client Option hanya punya 'id' dan 'name', tidak ada 'email' di Option[] */}
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {clients.length === 0 && <p className="text-sm text-red-500 mt-1">Anda harus <Link href="/dashboard/clients" className="underline">tambah klien baru</Link> terlebih dahulu.</p>}
        </div>
        
        {/* Field Layanan (Dropdown) */}
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">Pilih Layanan</label>
          <select
            id="serviceId"
            name="serviceId"
            required
            onChange={handleServiceChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading || services.length === 0}
          >
            <option value="">-- Pilih Layanan --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name} (Rp{service.basePrice.toLocaleString()})</option>
            ))}
          </select>
          {services.length === 0 && <p className="text-sm text-red-500 mt-1">Anda harus <Link href="/dashboard/services" className="underline">tambah layanan baru</Link> terlebih dahulu.</p>}
        </div>

        {/* Field Judul Proyek */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Proyek/Sesi</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Contoh: Pre-wedding Budi & Ani"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading}
          />
        </div>

        {/* Field Tanggal dan Lokasi (Garis Sama) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tanggal Sesi</label>
              <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isLoading}
              />
          </div>
          <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasi</label>
              <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="Contoh: Bali, Studio X"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isLoading}
              />
          </div>
        </div>
        
        {/* Harga Final */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga Final (Diskon/Tambahan)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={selectedServicePrice > 0 ? selectedServicePrice.toFixed(2) : undefined}
            onChange={(e) => setSelectedServicePrice(parseFloat(e.target.value) || 0)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={isLoading}
          />
          {selectedServicePrice > 0 && <p className="text-xs text-gray-500 mt-1">Harga dasar layanan dipilih: Rp{selectedServicePrice.toLocaleString()}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-yellow-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Membuat Pemesanan...' : 'Buat Pemesanan'}
        </button>
      </form>
    );
}