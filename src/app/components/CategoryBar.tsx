import { Smartphone, Shirt, Home, Dumbbell, BookOpen, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Barchasi', icon: null },
  { id: 'electronics', name: 'Elektronika', icon: Smartphone },
  { id: 'fashion', name: 'Kiyim', icon: Shirt },
  { id: 'home', name: 'Uy-ro\'zg\'or', icon: Home },
  { id: 'sports', name: 'Sport', icon: Dumbbell },
  { id: 'books', name: 'Kitoblar', icon: BookOpen },
  { id: 'beauty', name: 'Go\'zallik', icon: Sparkles },
];

interface CategoryBarProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export function CategoryBar({ selectedCategory, onCategorySelect }: CategoryBarProps) {
  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
