// =====================================================
// ADMIN PRODUCTS PAGE
// =====================================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminProductsList from './AdminProductsList';

export const metadata: Metadata = {
  title: 'Mahsulotlar | Admin Panel',
  description: 'Mahsulotlarni boshqarish',
};

export default async function AdminProductsPage() {
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

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (
    <AdminProductsList 
      products={products || []} 
      categories={categories || []} 
    />
  );
}
