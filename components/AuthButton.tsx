// components/AuthButton.tsx
'use client';

// Menggunakan getClientSupabase() untuk mendapatkan instance Supabase
import { getClientSupabase } from '@/lib/supabase/client'; 
import { useState, useEffect } from 'react';

export function AuthButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = getClientSupabase();
    if (!supabase) return; 

    // Ambil status sesi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || 'User');
      }
    });

    // Dengarkan perubahan status otentikasi secara real-time
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email || 'User');
        } else {
          setUserEmail(null);
        }
        // Gunakan refresh murni JS karena router.refresh() gagal sebelumnya
        window.location.reload();
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); 

  const handleSignIn = async () => {
    // Pengalihan menggunakan JavaScript murni
    window.location.href = '/login'; 
  };

  const handleSignOut = async () => {
    const supabase = getClientSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    // Pengalihan menggunakan JavaScript murni
    window.location.href = '/'; 
  };

  return (
    <div className="flex items-center space-x-2">
      {userEmail ? (
        <>
          <span className="text-sm text-gray-700 hidden sm:inline">
            {userEmail.split('@')[0]}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-md"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-lg"
        >
          Login/Daftar
        </button>
      )}
    </div>
  );
}