import { X, ShoppingCart, Heart, Star, Share2, ZoomIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductReviews } from './ProductReviews';
import { SocialProof } from './SocialProof';
import { StockCounter } from './StockCounter';
import { RelatedProducts } from './RelatedProducts';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  allProducts?: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductDetail({ product, isOpen, onClose, onAddToCart, allProducts = [], onProductClick }: ProductDetailProps) {
  const [reviews, setReviews] = useState<any[]>([]);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  // YANGI: Load reviews from localStorage
  useEffect(() => {
    if (product) {
      // Reset selections when product changes
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
      
      const savedReviews = localStorage.getItem(`veluna_reviews_${product.id}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        // Default demo reviews
        const defaultReviews = [
          {
            id: '1',
            userName: 'Aziz Rahimov',
            rating: 5,
            date: '15 Dekabr, 2024',
            comment: 'Juda yaxshi mahsulot! Tavsiya qilaman.',
            helpful: 12,
          },
          {
            id: '2',
            userName: 'Dilnoza Karimova',
            rating: 4,
            date: '10 Dekabr, 2024',
            comment: 'Yaxshi, lekin yetkazib berish biroz kech bo\'ldi.',
            helpful: 5,
          },
        ];
        setReviews(defaultReviews);
      }
    }
  }, [product]);

  // YANGI: Save reviews to localStorage
  const handleAddReview = (review: any) => {
    if (!product) return;
    
    const newReview = {
      ...review,
      id: Date.now().toString(),
      helpful: 0,
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`veluna_reviews_${product.id}`, JSON.stringify(updatedReviews));
  };

  if (!isOpen || !product) return null;

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stock = Math.floor(Math.random() * 8) + 2;
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Qora', 'Oq', 'Ko\'k', 'Qizil'];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `${product.name} - ${product.price.toLocaleString()} so'm`,
        url: window.location.href,
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 overflow-y-auto backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <div className="min-h-screen flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="dark:text-white">Mahsulot haqida</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden mb-4 group">
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
                    <button className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Thumbnail gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-600">
                        <ImageWithFallback
                          src={product.image}
                          alt={`${product.name} ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl mb-2 dark:text-white">{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="dark:text-white">{product.rating}</span>
                      </div>
                      <span className="text-gray-500">({product.reviews} baholash)</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{reviews.length} sharh</span>
                    </div>

                    {/* Social Proof */}
                    <SocialProof productId={product.id} />

                    {/* Price */}
                    <div className="flex items-center gap-3 my-4">
                      <span className="text-3xl text-emerald-600">
                        {product.price.toLocaleString()} so'm
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {product.originalPrice.toLocaleString()} so'm
                        </span>
                      )}
                    </div>

                    {/* Stock Counter */}
                    <StockCounter stock={stock} />
                  </div>

                  {/* Size selector - YANGI: Barcha mahsulotlar uchun */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h4 className="mb-2 dark:text-white">O'lcham: <span className="text-red-500">*</span></h4>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[48px] h-12 px-3 border-2 rounded-lg transition-colors ${
                              selectedSize === size
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-600 dark:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color selector - YANGI: Barcha mahsulotlar uchun */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h4 className="mb-2 dark:text-white">Rang:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                              selectedColor === color
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-600 dark:text-white'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <h3 className="mb-2 dark:text-white">Tavsif</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Bu yuqori sifatli mahsulot sizning ehtiyojlaringizni to'liq qondiradi. 
                      Zamonaviy dizayn va ishonchli sifat kafolati bilan. Tezkor yetkazib berish xizmati mavjud.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <h3 className="mb-2 dark:text-white">Xususiyatlari</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li>✓ Yuqori sifat kafolati</li>
                      <li>✓ 1 yil kafolat</li>
                      <li>✓ Tez yetkazib berish (1-3 kun)</li>
                      <li>✓ Bepul qaytarish 14 kun ichida</li>
                      <li>✓ 24/7 qo'llab-quvvatlash</li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-4">
                    <button
                      onClick={() => {
                        onAddToCart(product, selectedSize, selectedColor);
                      }}
                      disabled={!product.inStock}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Savatga qo'shish
                    </button>
                    <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Heart className="w-5 h-5 dark:text-white" />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="w-5 h-5 dark:text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-8 pt-8 border-t dark:border-gray-700">
                <ProductReviews
                  productId={product.id}
                  reviews={reviews}
                  onAddReview={handleAddReview}
                />
              </div>

              {/* Related Products */}
              {onProductClick && (
                <RelatedProducts
                  products={allProducts}
                  currentProductId={product.id}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}