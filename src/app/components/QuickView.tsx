import { X, ShoppingCart, Heart, Star, Share2 } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onViewDetails: (product: Product) => void;
}

export function QuickView({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist,
  onViewDetails 
}: QuickViewProps) {
  if (!isOpen || !product) return null;

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Quick View Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <h3 className="dark:text-white">Tez ko'rish</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="mb-3 dark:text-white">{product.name}</h2>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="dark:text-white">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">({product.reviews} baholash)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-emerald-600 text-2xl">
                      {product.price.toLocaleString()} so'm
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 dark:text-gray-500 line-through text-lg">
                        {product.originalPrice.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  {product.inStock ? (
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded text-sm">
                      ✓ Omborda bor
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded text-sm">
                      Tugagan
                    </span>
                  )}
                </div>

                {/* Quick description */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="mb-2 dark:text-white">Qisqacha ma'lumot</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>✓ Yuqori sifat kafolati</li>
                    <li>✓ Tez yetkazib berish</li>
                    <li>✓ 14 kun ichida qaytarish</li>
                    <li>✓ Bepul yetkazib berish 500,000 so'mdan</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                    }}
                    disabled={!product.inStock}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Savatga
                  </button>
                  <button 
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 border rounded-lg transition-colors ${
                      isInWishlist 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onViewDetails(product);
                    onClose();
                  }}
                  className="w-full text-emerald-600 dark:text-emerald-400 py-2 text-sm hover:underline"
                >
                  To'liq ma'lumotni ko'rish →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}