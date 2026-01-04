// =====================================================
// PRODUCTS SERVICE - API Layer
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type { Product, Category, ProductFilters, PaginatedResponse } from '@/types';

const supabase = createClient();

// Get all products with filters and pagination
export async function getProducts(
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<Product>> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true);

  // Apply filters
  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters?.inStock) {
    query = query.gt('stock', 0);
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('reviews_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

// Get featured products
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

// Get products by category
export async function getProductsByCategory(
  categorySlug: string,
  limit: number = 12
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories!inner(*)')
    .eq('is_active', true)
    .eq('category.slug', categorySlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

// Search products
export async function searchProducts(query: string, limit: number = 10): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
}
