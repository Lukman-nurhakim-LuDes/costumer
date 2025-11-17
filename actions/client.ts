// actions/client.ts
'use server'; // WAJIB ada di baris pertama untuk menandai ini adalah Server Action

import { createServerSupabaseClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Interface untuk tipe data yang diharapkan
interface ClientFormData {
  name: string;
  email: string;
  phone: string;
}

export async function createClient(formData: ClientFormData) {
  // 1. Ambil User ID dari Supabase (Wajib untuk RLS)
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Autentikasi diperlukan.' };
  }
  
  const userId = user.id;

  try {
    // 2. Validasi Input (Sederhana)
    if (!formData.name || !formData.email) {
      return { success: false, message: 'Nama dan Email wajib diisi.' };
    }

    // 3. Simpan Data ke Database menggunakan Prisma
    await prisma.client.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        userId: userId, // KUNCI RLS: Mengaitkan data dengan pemiliknya
      },
    });

    // 4. Perbarui Cache Halaman
    // Ini memastikan daftar klien diperbarui setelah penambahan
    revalidatePath('/dashboard/clients'); 
    
    return { success: true, message: 'Klien berhasil ditambahkan!' };
    
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    if (error.code === 'P2002') { // Kode unik Prisma untuk duplikasi
        return { success: false, message: 'Email klien sudah terdaftar.' };
    }
    return { success: false, message: 'Gagal menambahkan klien karena kesalahan server.' };
  }
}