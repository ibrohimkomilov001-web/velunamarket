// =====================================================
// BANNERS SERVICE - API Layer
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type { Banner } from '@/types';

const supabase = createClient();

// Get all active banners
export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }

  return data || [];
}
