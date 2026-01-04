// =====================================================
// PRODUCT DETAIL PAGE
// =====================================================

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ProductGrid } from '@/components/products';
import { AddToCartButton } from './AddToCartButton';

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentProductId)
    .limit(4);

  return products || [];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return { title: 'Mahsulot topilmadi' };
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - Veluna Marketda eng qulay narxda`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} - Veluna Marketda`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  const discount = calculateDiscount(product.price, product.original_price);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Mahsulotlar</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-primary-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {[product.image_url, ...product.images].map((img, idx) => (
                  <button
                    key={idx}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 flex-shrink-0"
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-primary-600 hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500">
                {product.rating} ({product.reviews_count} ta sharh)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  ✓ Mavjud ({product.stock} dona)
                </p>
              ) : (
                <p className="text-red-600 font-medium">✗ Tugagan</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Tavsif</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t dark:border-gray-700">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-xs text-gray-500">Bepul yetkazish</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-xs text-gray-500">Kafolat</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-xs text-gray-500">14 kun qaytarish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">O'xshash mahsulotlar</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
