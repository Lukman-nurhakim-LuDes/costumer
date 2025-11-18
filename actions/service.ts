// actions/service.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
// Wajib: Import tipe error Prisma yang diketahui
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

interface ServiceFormData {
  name: string;
  description: string;
  basePrice: string; 
}

export async function createService(formData: ServiceFormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Autentikasi diperlukan.' };
  }
  
  const userId = user.id;

  try {
    const price = parseFloat(formData.basePrice);

    if (isNaN(price)) {
        return { success: false, message: 'Harga Dasar harus berupa angka yang valid.' };
    }
    if (!formData.name) {
        return { success: false, message: 'Nama layanan wajib diisi.' };
    }

    // Simpan Data ke Database
    await prisma.service.create({
      data: {
        name: formData.name,
        description: formData.description || null,
        basePrice: price,
        userId: userId, // KUNCI RLS: Isolasi data
      },
    });

    revalidatePath('/dashboard/services'); 
    
    return { success: true, message: `Layanan '${formData.name}' berhasil ditambahkan!` };
    
  } catch (error) {
    // 5. Perbaikan Type Error: Melakukan Type Narrowing
    console.error('SERVER ACTION ERROR:', error);
    
    // Memeriksa apakah error adalah error duplikasi unik Prisma (P2002)
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { 
            return { success: false, message: 'Nama layanan ini sudah ada.' };
        }
    }
    
    return { success: false, message: 'Gagal menambahkan layanan karena kesalahan server.' };
  }
}