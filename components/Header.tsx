import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AuthButton } from './AuthButton'; 

// Fungsi Server Component
export default async function Header() {
  // MENGAMBIL DATA DI SISI SERVER (Server Component)
  const supabase = createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">Photography Dashboard</h1>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="text-gray-700">
            Selamat datang, **{user.email}**!
          </div>
        ) : (
          <div className="text-gray-500">
            Anda belum login
          </div>
        )}
        <AuthButton />
      </div>
    </header>
  );
}