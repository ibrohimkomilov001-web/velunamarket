import { Zap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FlashSaleProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function FlashSale({ products, onProductClick, onAddToCart }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 15,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter(p => p.originalPrice).slice(0, 4);
  if (flashProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-red-500 to-orange-500 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="text-white text-2xl md:text-3xl">Tezkor savdo!</h2>
              <p className="text-white/80 text-sm">Chegirmalar tez orada tugaydi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
            <div className="flex gap-2 text-white">
              <div className="text-center">
                <div className="text-2xl font-mono">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs">Soat</div>
              </div>
              <div className="text-2xl">:</div>
              <div className="text-center">
                <div className="text-2xl font-mono">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs">Daq</div>
              </div>
              <div className="text-2xl">:</div>
              <div className="text-center">
                <div className="text-2xl font-mono">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs">Son</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashProducts.map((product) => {
            const discount = product.originalPrice 
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                    -{discount}%
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm mb-2 line-clamp-2 dark:text-white">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 text-lg">{product.price.toLocaleString()}</span>
                    <span className="text-gray-400 line-through text-xs">{product.originalPrice?.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Xarid qilish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
