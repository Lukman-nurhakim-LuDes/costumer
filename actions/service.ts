// actions/booking.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

interface BookingFormData {
  clientId: string; 
  serviceId: string; 
  title: string;
  date: string; 
  location: string;
  price: string; 
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
    
    await prisma.booking.create({
      data: {
        title: formData.title,
        date: new Date(formData.date), 
        location: formData.location,
        price: finalPrice,
        clientId: formData.clientId,
        serviceId: formData.serviceId,
        userId: userId, 
        status: 'Scheduled', 
      },
    });

    revalidatePath('/dashboard/bookings'); 
    
    return { success: true, message: `Pemesanan "${formData.title}" berhasil dibuat!` };
    
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    
    // Type Narrowing Fix
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { 
            return { success: false, message: 'Judul pemesanan sudah digunakan.' };
        }
    }
    
    return { success: false, message: 'Gagal membuat pemesanan. Cek koneksi atau input Anda.' };
  }
}