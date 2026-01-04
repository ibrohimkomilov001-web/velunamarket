// =====================================================
// PRODUCTS FILTERS - CLIENT COMPONENT
// =====================================================

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ProductsFiltersProps {
  currentSort?: string;
}

export default function ProductsFilters({ currentSort }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Saralash:</span>
        <select
          value={currentSort || 'newest'}
          onChange={handleSortChange}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Eng yangi</option>
          <option value="popular">Mashhur</option>
          <option value="price-asc">Narx: past → yuqori</option>
          <option value="price-desc">Narx: yuqori → past</option>
        </select>
      </div>
    </div>
  );
}
