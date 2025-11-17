// components/AuthButton.tsx
'use client'; // WAJIB ada di baris pertama

import { createClientSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase.auth]);

  const handleSignIn = async () => {
    // Aksi untuk login (contoh: Google Auth)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Sesuaikan ini nanti
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Muat ulang sesi
  };

  return (
    <>
      {user ? (
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login/Daftar
        </button>
      )}
    </>
  );
}