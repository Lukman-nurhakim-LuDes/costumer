// actions/payment.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface PaymentFormData {
  bookingId: string;
  amount: string; // Ambil sebagai string, konversi ke Float
  paymentStatus: 'DP Paid' | 'Fully Paid';
}

export async function createPayment(formData: PaymentFormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Autentikasi diperlukan.' };
  }
  
  const userId = user.id;

  try {
    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Jumlah pembayaran tidak valid.' };
    }
    
    // Simpan Data Pembayaran ke Database
    await prisma.payment.create({
      data: {
        amount: amount,
        paymentStatus: formData.paymentStatus,
        bookingId: formData.bookingId,
        userId: userId, // Kunci RLS
      },
    });

    // Opsional: Perbarui status Booking jika pembayaran LUNAS
    if (formData.paymentStatus === 'Fully Paid') {
        await prisma.booking.update({
            where: { id: formData.bookingId },
            data: { status: 'Completed' } // Asumsi: Jika lunas, status proyek selesai
        });
    }

    revalidatePath('/dashboard/invoices'); 
    
    return { success: true, message: `Pembayaran berhasil dicatat!` };
    
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    return { success: false, message: 'Gagal mencatat pembayaran karena kesalahan server.' };
  }
}