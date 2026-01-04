import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronRight } from 'lucide-react';

interface RecentlyViewedProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function RecentlyViewed({ products, onProductClick }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl">Oxirgi ko'rilgan</h2>
        <button className="text-emerald-600 text-sm flex items-center gap-1 hover:underline">
          Hammasi
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 pb-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="flex-shrink-0 w-40 md:w-48 cursor-pointer group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-sm mb-1 line-clamp-2 group-hover:text-emerald-600">
                {product.name}
              </h4>
              <p className="text-emerald-600">
                {product.price.toLocaleString()} so'm
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
