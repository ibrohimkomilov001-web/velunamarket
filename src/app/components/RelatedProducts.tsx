import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: number;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function RelatedProducts({ products, currentProductId, onProductClick, onAddToCart }: RelatedProductsProps) {
  const related = products.filter(p => p.id !== currentProductId).slice(0, 4);
  
  if (related.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t dark:border-gray-700">
      <h3 className="mb-4 dark:text-white">O'xshash mahsulotlar</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <div
            key={product.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onProductClick(product)}
          >
            <div className="aspect-square bg-gray-200 dark:bg-gray-800">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="p-3">
              <h4 className="text-sm mb-2 line-clamp-2 dark:text-white">{product.name}</h4>
              <p className="text-emerald-600 mb-2">{product.price.toLocaleString()} so'm</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="w-full bg-emerald-600 text-white py-2 rounded text-sm hover:bg-emerald-700"
              >
                Savatga
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
