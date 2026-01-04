import { Sparkles } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecommendedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function RecommendedProducts({ products, onProductClick, onAddToCart }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl md:text-3xl dark:text-white">Siz uchun tavsiya</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onProductClick(product)}
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden mb-2">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h4 className="text-sm mb-1 line-clamp-2 dark:text-white">{product.name}</h4>
              <div className="flex items-center justify-between">
                <p className="text-emerald-600 text-sm">{product.price.toLocaleString()}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
