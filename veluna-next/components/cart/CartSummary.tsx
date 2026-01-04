// =====================================================
// CART SUMMARY COMPONENT
// =====================================================

'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui';

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = getTotal();
  const shippingCost = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-4">Buyurtma xulosasi</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Mahsulotlar</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Yetkazib berish</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Bepul</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        {subtotal < 500000 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            * 500,000 so'm dan ortiq xaridda yetkazib berish bepul
          </p>
        )}

        <div className="border-t dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Jami</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="block mt-6">
        <Button fullWidth size="lg">
          Buyurtma berish
        </Button>
      </Link>

      <Link
        href="/products"
        className="block text-center text-sm text-primary-600 hover:underline mt-4"
      >
        Xaridni davom ettirish
      </Link>
    </div>
  );
}
