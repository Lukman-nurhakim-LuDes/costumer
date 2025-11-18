// components/AddServiceForm.tsx
'use client';

import { useState } from 'react';
import { createService } from '@/actions/service'; // Menggunakan Server Action yang sudah dibuat
import Link from 'next/link';

export default function AddServiceForm() {
  const [status, setStatus] = useState<{ message: string, success: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      basePrice: formData.get('basePrice') as string,
    };

    const result = await createService(serviceData);
    
    setStatus(result);
    setIsLoading(false);

    if (result.success) {
      event.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-indigo-50 rounded-2xl shadow-md">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">Tambahkan Tipe Layanan Baru</h3>
      
      {/* Notifikasi Status */}
      {status && (
        <div className={`p-3 rounded-lg text-sm ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}

      {/* Field Nama Layanan */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Layanan (Contoh: Wedding, Corporate)</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isLoading}
        />
      </div>

      {/* Field Harga Dasar */}
      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Harga Dasar (Rp)</label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          step="0.01"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isLoading}
        />
      </div>

      {/* Field Deskripsi */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat (Opsional)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Menyimpan...' : 'Definisikan Layanan'}
      </button>
    </form>
  );
}