import { ShoppingCart, Heart, Eye, Scale } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[]; // YANGI: Razmerlar ro'yxati
  colors?: string[]; // YANGI: Ranglar ro'yxati
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onQuickView?: (product: Product) => void;
  onAddToCompare?: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onProductClick, 
  onToggleWishlist, 
  isInWishlist,
  onQuickView,
  onAddToCompare
}: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            -{discount}%
          </div>
        )}
        
        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2.5 md:p-2 rounded-full shadow transition-all active:scale-95 ${
              isInWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 md:w-4 md:h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 md:p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-all active:scale-95"
            >
              <Eye className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          )}
          
          {onAddToCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCompare(product);
              }}
              className="p-2.5 md:p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-all active:scale-95"
            >
              <Scale className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          )}
        </div>
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded">Tugagan</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 
          className="text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 min-h-[2.5rem]"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-emerald-600 text-base md:text-lg">
            {product.price.toLocaleString()} so'm
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-xs">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="w-full bg-emerald-600 text-white py-3 md:py-2 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
        >
          <ShoppingCart className="w-4 h-4" />
          Savatga
        </button>
      </div>
    </div>
  );
}