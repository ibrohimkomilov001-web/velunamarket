import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // YANGI: Tanlangan razmer
  selectedColor?: string; // YANGI: Tanlangan rang
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem: (productId: number, selectedSize?: string, selectedColor?: string) => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Savat ({totalItems})</h2>
          
          {/* YANGI: Desktop uchun X tugmasi */}
          <button
            onClick={onClose}
            className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Yopish"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 pb-[100px]">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Savat bo'sh</p>
              <p className="text-sm mt-2">Mahsulot qo'shing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                    
                    {/* YANGI: Razmer va Rang ko'rsatish */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex items-center gap-2 mb-1">
                        {item.selectedSize && (
                          <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-300">
                            📏 {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-300">
                            🎨 {item.selectedColor}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-emerald-600 mb-2 text-base">
                      {item.price.toLocaleString()} so'm
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)}
                        className="p-2 bg-white rounded border hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="p-2 bg-white rounded border hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded active:scale-95 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 pb-24 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Jami:</span>
              <span className="text-emerald-600 text-xl">{total.toLocaleString()} so'm</span>
            </div>
            <button 
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-emerald-600 text-white py-4 md:py-3 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all text-base"
            >
              Rasmiylashtirish
            </button>
          </div>
        )}
      </div>
    </>
  );
}