// =====================================================
// CATEGORIES PAGE
// =====================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/services';

export const metadata: Metadata = {
  title: 'Kategoriyalar | Veluna Market',
  description: 'Veluna Market mahsulot kategoriyalari',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Barcha Kategoriyalar</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {category.image_url && (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-200 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!categories || categories.length === 0) && (
        <div className="text-center py-16">
          <p className="text-gray-500">Hozircha kategoriyalar mavjud emas</p>
        </div>
      )}
    </div>
  );
}
