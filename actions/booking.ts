// actions/booking.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface BookingFormData {
  clientId: string; // ID Klien yang dipilih
  serviceId: string; // ID Layanan yang dipilih
  title: string;
  date: string; // Tanggal sesi
  location: string;
  price: string; // Harga final
}

export async function createBooking(formData: BookingFormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Autentikasi diperlukan.' };
  }
  
  const userId = user.id;

  try {
    const finalPrice = parseFloat(formData.price);

    if (!formData.clientId || !formData.serviceId || !formData.date) {
        return { success: false, message: 'Klien, Layanan, dan Tanggal wajib diisi.' };
    }
    if (isNaN(finalPrice)) {
        return { success: false, message: 'Harga final harus berupa angka yang valid.' };
    }
    
    // Simpan Data ke Database
    await prisma.booking.create({
      data: {
        title: formData.title,
        date: new Date(formData.date), // Konversi string tanggal ke objek Date
        location: formData.location,
        price: finalPrice,
        clientId: formData.clientId,
        serviceId: formData.serviceId,
        userId: userId, // Kunci RLS
        status: 'Scheduled', // Status default
      },
    });

    revalidatePath('/dashboard/bookings'); 
    
    return { success: true, message: `Pemesanan "${formData.title}" berhasil dibuat!` };
    
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    return { success: false, message: 'Gagal membuat pemesanan. Cek koneksi atau input Anda.' };
  }
}