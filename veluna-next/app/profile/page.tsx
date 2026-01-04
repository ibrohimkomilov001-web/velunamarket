// =====================================================
// USER PROFILE PAGE
// =====================================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileContent from './ProfileContent';

export const metadata: Metadata = {
  title: 'Shaxsiy kabinet | Veluna Market',
  description: 'Veluna Market shaxsiy kabinet',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Foydalanuvchi ma'lumotlarini olish
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Buyurtmalar tarixini olish
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shaxsiy kabinet</h1>
      <ProfileContent 
        user={user} 
        profile={profile} 
        orders={orders || []} 
      />
    </div>
  );
}
