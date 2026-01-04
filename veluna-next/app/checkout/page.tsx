// =====================================================
// CHECKOUT PAGE
// =====================================================

import { Metadata } from 'next';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = {
  title: 'Buyurtma berish',
  description: 'Buyurtmangizni rasmiylashting',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Buyurtma berish</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
