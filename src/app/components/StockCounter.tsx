import { Package } from 'lucide-react';

interface StockCounterProps {
  stock: number;
}

export function StockCounter({ stock }: StockCounterProps) {
  if (stock > 10) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      stock <= 3 
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
        : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
    }`}>
      <Package className="w-4 h-4" />
      <span className="text-sm">
        {stock <= 3 ? '⚠️ ' : ''}
        Faqat <strong>{stock}</strong> ta qoldi!
      </span>
    </div>
  );
}
