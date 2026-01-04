import { X, Scale } from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CompareProductsProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (productId: number) => void;
}

export function CompareProducts({ isOpen, onClose, products, onRemove }: CompareProductsProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Compare modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <h2>Mahsulotlarni solishtirish</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Scale className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Solishtirish uchun mahsulotlar yo'q</p>
                <p className="text-sm mt-2">Mahsulot kartasida solishtirish tugmasini bosing</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b dark:border-gray-700">Parametr</th>
                      {products.map((product) => (
                        <th key={product.id} className="p-2 border-b dark:border-gray-700 min-w-[200px]">
                          <div className="relative">
                            <button
                              onClick={() => onRemove(product.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <p className="text-sm line-clamp-2">{product.name}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b dark:border-gray-700">Narxi</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-2 border-b dark:border-gray-700 text-center">
                          <p className="text-emerald-600">{product.price.toLocaleString()} so'm</p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b dark:border-gray-700">Reyting</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-2 border-b dark:border-gray-700 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span>⭐ {product.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b dark:border-gray-700">Sharhlar</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-2 border-b dark:border-gray-700 text-center">
                          {product.reviews} ta
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 border-b dark:border-gray-700">Holati</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-2 border-b dark:border-gray-700 text-center">
                          {product.inStock ? (
                            <span className="text-green-600">Mavjud</span>
                          ) : (
                            <span className="text-red-600">Tugagan</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2">Kategoriya</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-2 text-center capitalize">
                          {product.category}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}