import { ChevronRight, Smartphone, Shirt, Home, Dumbbell, BookOpen, Sparkles, X } from 'lucide-react';

interface CatalogPageProps {
  onCategorySelect: (category: string) => void;
  onBackToHome: () => void;
}

export function CatalogPage({ onCategorySelect, onBackToHome }: CatalogPageProps) {
  const categories = [
    { id: 'electronics', name: 'Elektronika', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'fashion', name: 'Kiyim', icon: Shirt, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'home', name: "Uy-ro'zg'or", icon: Home, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'sports', name: 'Sport', icon: Dumbbell, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'books', name: 'Kitoblar', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'beauty', name: "Go'zallik", icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onBackToHome();
    // Mahsulotlarga scroll qilish
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Katalog</h1>
            <p className="text-emerald-50 mt-2">Kategoriyani tanlang</p>
          </div>
          
          {/* YANGI: Desktop uchun X tugmasi */}
          <button
            onClick={onBackToHome}
            className="hidden md:flex p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Yopish"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-4">
        <div className="space-y-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-full flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-all border-2 border-gray-100 dark:border-gray-700 group active:scale-95"
              >
                {/* Icon */}
                <div className={`${category.bg} dark:bg-gray-700 ${category.color} dark:text-white w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Name */}
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Mahsulotlarni ko'rish
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}