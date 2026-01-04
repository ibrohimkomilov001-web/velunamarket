import { Gift, Plus } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Bundle {
  id: string;
  name: string;
  products: Product[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
}

interface BundleDealsProps {
  bundles: Bundle[];
  onAddToCart: (products: Product[]) => void;
}

export function BundleDeals({ bundles, onAddToCart }: BundleDealsProps) {
  if (bundles.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl md:text-3xl dark:text-white">To'plamlar - ko'proq tejang!</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1 dark:text-white">{bundle.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {bundle.products.length} mahsulot
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 px-3 py-1 rounded-full text-sm">
                -{bundle.discount}%
              </div>
            </div>

            {/* Products */}
            <div className="flex items-center gap-3 mb-4 overflow-x-auto">
              {bundle.products.map((product, idx) => (
                <div key={product.id} className="flex items-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {idx < bundle.products.length - 1 && (
                    <Plus className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 line-through mb-1">
                  {bundle.originalPrice.toLocaleString()} so'm
                </p>
                <p className="text-2xl text-emerald-600">
                  {bundle.bundlePrice.toLocaleString()} so'm
                </p>
              </div>
              <p className="text-sm text-green-600">
                Tejaysiz: {(bundle.originalPrice - bundle.bundlePrice).toLocaleString()} so'm
              </p>
            </div>

            <button
              onClick={() => onAddToCart(bundle.products)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              To'plamni xarid qilish
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
