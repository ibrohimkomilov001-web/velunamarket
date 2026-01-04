import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  sortBy: 'default' | 'price-low' | 'price-high' | 'newest' | 'popular';
  priceRange: { min: number; max: number };
  inStock: boolean;
}

export function FilterBar({ onFilterChange, activeFilters }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(activeFilters);

  const sortOptions = [
    { value: 'default', label: 'Standart' },
    { value: 'price-low', label: 'Arzon avval' },
    { value: 'price-high', label: 'Qimmat avval' },
    { value: 'newest', label: 'Yangi mahsulotlar' },
    { value: 'popular', label: 'Mashhur' },
  ];

  const priceRanges = [
    { min: 0, max: 100000, label: '0 - 100,000' },
    { min: 100000, max: 500000, label: '100,000 - 500,000' },
    { min: 500000, max: 1000000, label: '500,000 - 1M' },
    { min: 1000000, max: 5000000, label: '1M - 5M' },
    { min: 5000000, max: 20000000, label: '5M+' },
  ];

  const handleApply = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      sortBy: 'default',
      priceRange: { min: 0, max: 20000000 },
      inStock: false,
    };
    setTempFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = 
    (activeFilters.sortBy !== 'default' ? 1 : 0) +
    (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 20000000 ? 1 : 0) +
    (activeFilters.inStock ? 1 : 0);

  return (
    <>
      {/* Filter button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 md:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div 
              className="bg-white w-full md:max-w-lg md:rounded-lg rounded-t-3xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b">
                <h2>Filtrlash</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Sort by */}
                <div>
                  <h3 className="mb-3">Saralash</h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={tempFilters.sortBy === option.value}
                          onChange={(e) => setTempFilters({ ...tempFilters, sortBy: e.target.value as any })}
                          className="w-5 h-5 text-emerald-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h3 className="mb-3">Narx oralig'i</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={tempFilters.priceRange.min === range.min && tempFilters.priceRange.max === range.max}
                          onChange={() => setTempFilters({ ...tempFilters, priceRange: { min: range.min, max: range.max } })}
                          className="w-5 h-5 text-emerald-600"
                        />
                        <span>{range.label} so'm</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* In stock only */}
                <div>
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempFilters.inStock}
                      onChange={(e) => setTempFilters({ ...tempFilters, inStock: e.target.checked })}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                    <div>
                      <p>Faqat mavjud mahsulotlar</p>
                      <p className="text-xs text-gray-500">Tugagan mahsulotlarni yashirish</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 md:p-6 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 py-3.5 md:py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tozalash
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 bg-emerald-600 text-white py-3.5 md:py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Qo'llash
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}