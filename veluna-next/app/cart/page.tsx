// =====================================================
// CART PAGE
// =====================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui';
import { CartContent } from './CartContent';

export const metadata: Metadata = {
  title: 'Savat',
  description: 'Savatdagi mahsulotlaringiz',
};

export default function CartPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Savat</h1>
        <CartContent />
      </div>
    </div>
  );
}
