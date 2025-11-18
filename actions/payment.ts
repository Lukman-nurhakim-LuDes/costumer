// actions/payment.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

interface PaymentFormData {
  bookingId: string;
  amount: string; 
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
    
    await prisma.payment.create({
      data: {
        amount: amount,
        paymentStatus: formData.paymentStatus,
        bookingId: formData.bookingId,
        userId: userId, 
      },
    });

    if (formData.paymentStatus === 'Fully Paid') {
        await prisma.booking.update({
            where: { id: formData.bookingId },
            data: { status: 'Completed' } 
        });
    }

    revalidatePath('/dashboard/invoices'); 
    revalidatePath('/dashboard'); // Perlu diperbarui untuk Stat Cards
    
    return { success: true, message: `Pembayaran berhasil dicatat!` };
    
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    
    // Type Narrowing Fix
    if (error instanceof PrismaClientKnownRequestError) {
        // Biasanya tidak ada P2002 di payment, tapi kita pertahankan type safety
    }

    return { success: false, message: 'Gagal mencatat pembayaran karena kesalahan server.' };
  }
}