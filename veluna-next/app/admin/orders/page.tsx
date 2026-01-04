// =====================================================
// ADMIN ORDERS PAGE
// =====================================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminOrdersList from './AdminOrdersList';

export const metadata: Metadata = {
  title: 'Buyurtmalar | Admin Panel',
  description: 'Buyurtmalarni boshqarish',
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminOrdersList orders={orders || []} />;
}
