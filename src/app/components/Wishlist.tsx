import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

export function Wishlist({ isOpen, onClose, items, onRemoveItem, onAddToCart }: WishlistProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-x-0 top-0 bottom-20 md:bottom-0 bg-black/40 dark:bg-black/60 z-[55] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Wishlist sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white z-[56] shadow-2xl flex flex-col pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Sevimlilar ({items.length})</h2>
          
          {/* YANGI: Desktop uchun X tugmasi */}
          <button
            onClick={onClose}
            className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Yopish"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Wishlist items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Sevimlilar bo'sh</p>
              <p className="text-sm mt-2">Mahsulotlarni sevimlilar ro'yxatiga qo'shing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-emerald-600">
                          {item.price.toLocaleString()} so'm
                        </span>
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through text-xs">
                            {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(item);
                            onRemoveItem(item.id);
                          }}
                          disabled={!item.inStock}
                          className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Savatga</span>
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}