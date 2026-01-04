// =====================================================
// HOME PAGE
// =====================================================

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductGrid } from '@/components/products';
import { createClient } from '@/lib/supabase/server';

// Server component - data fetching
async function getFeaturedProducts() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return products || [];
}

async function getBanners() {
  const supabase = await createClient();
  
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(3);

  return banners || [];
}

async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return categories || [];
}

export default async function HomePage() {
  const [products, banners, categories] = await Promise.all([
    getFeaturedProducts(),
    getBanners(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        {banners[0] && (
          <Image
            src={banners[0].image_url}
            alt={banners[0].title}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                {banners[0]?.title || 'Veluna Market'}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {banners[0]?.subtitle ||
                  'Eng yaxshi mahsulotlar eng qulay narxlarda'}
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Xarid qilish
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Kategoriyalar
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <span className="text-2xl">{getCategoryEmoji(category.slug)}</span>
                </div>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Tavsiya etilgan</h2>
            <Link
              href="/products"
              className="text-primary-600 hover:underline flex items-center gap-1"
            >
              Barchasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Truck className="w-8 h-8" />}
              title="Bepul yetkazib berish"
              description="500,000 so'mdan ortiq xaridlarda"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Xavfsiz to'lov"
              description="100% xavfsiz tranzaksiyalar"
            />
            <FeatureCard
              icon={<Headphones className="w-8 h-8" />}
              title="24/7 Qo'llab-quvvatlash"
              description="Har doim yordam berishga tayyormiz"
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Qulay to'lov"
              description="Payme, Click, naqd pul"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Yangiliklar va chegirmalardan xabardor bo'ling
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Email manzilingizni qoldiring va birinchilardan bo'lib chegirmalar
            haqida bilib oling
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email manzilingiz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary-600 hover:bg-gray-100">
              Obuna bo'lish
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

function getCategoryEmoji(slug: string): string {
  const emojis: Record<string, string> = {
    electronics: '📱',
    fashion: '👔',
    home: '🏠',
    sports: '⚽',
    books: '📚',
    beauty: '✨',
  };
  return emojis[slug] || '📦';
}
