// =====================================================
// PRODUCTS PAGE
// =====================================================

import { Metadata } from 'next';
import { ProductGrid } from '@/components/products';
import { createClient } from '@/lib/supabase/server';
import ProductsFilters from './ProductsFilters';

export const metadata: Metadata = {
  title: 'Mahsulotlar',
  description: 'Veluna Market - Barcha mahsulotlar. Elektronika, kiyim-kechak, sport va boshqa tovarlar.',
};

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

async function getProducts(params: SearchParams) {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true);

  // Category filter
  if (params.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single();
    
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Search filter
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }

  // Sorting
  switch (params.sort) {
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
  const page = parseInt(params.page || '1');
  const limit = 12;
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data: products, count } = await query;

  return { products: products || [], count: count || 0, page, limit };
}

async function getCategories() {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return data || [];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Next.js 16: searchParams is now a Promise
  const params = await searchParams;

  const [{ products, count, page, limit }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const totalPages = Math.ceil(count / limit);

  // Get current category name for title
  const currentCategory = params.category
    ? categories.find((c: any) => c.slug === params.category)?.name
    : null;

  const pageTitle = currentCategory
    ? currentCategory
    : params.search
    ? `"${params.search}" bo'yicha natijalar`
    : 'Barcha mahsulotlar';

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-gray-500">{count} ta mahsulot topildi</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Kategoriyalar</h3>
                <div className="space-y-2">
                  <a
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !params.category
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Barchasi
                  </a>
                  {categories.map((cat: any) => (
                    <a
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        params.category === cat.slug
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Filter */}
            <ProductsFilters currentSort={params.sort} />

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <ProductGrid products={products as any} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {page > 1 && (
                      <a
                        href={`/products?page=${page - 1}${params.category ? `&category=${params.category}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Oldingi
                      </a>
                    )}
                    
                    <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                      {page} / {totalPages}
                    </span>
                    
                    {page < totalPages && (
                      <a
                        href={`/products?page=${page + 1}${params.category ? `&category=${params.category}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Keyingi
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Mahsulotlar topilmadi</p>
                <a
                  href="/products"
                  className="inline-block mt-4 text-primary-600 hover:underline"
                >
                  Barcha mahsulotlarni ko'rish
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
