// =====================================================
// ADMIN DASHBOARD PAGE
// =====================================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Panel | Veluna Market',
  description: 'Veluna Market admin boshqaruv paneli',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Foydalanuvchi kirmaganida login sahifasiga yo'naltirish
  if (!user) {
    redirect('/admin/login');
  }

  // Admin huquqini tekshirish
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Statistikalarni olish
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: usersCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*, user:users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const stats = {
    products: productsCount || 0,
    orders: ordersCount || 0,
    users: usersCount || 0,
  };

  return <AdminDashboard stats={stats} recentOrders={recentOrders || []} />;
}
