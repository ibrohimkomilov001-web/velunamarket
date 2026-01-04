// =====================================================
// CART CONTENT - Client Component
// =====================================================

'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { CartItem, CartSummary } from '@/components/cart';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store';

export function CartContent() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Savat bo'sh</h2>
        <p className="text-gray-500 mb-6">
          Hali hech qanday mahsulot qo'shilmagan
        </p>
        <Link href="/products">
          <Button>Xarid qilishni boshlash</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500">{items.length} ta mahsulot</p>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Barchasini o'chirish
          </button>
        </div>
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div>
        <CartSummary />
      </div>
    </div>
  );
}
