// =====================================================
// CHECKOUT FORM - Client Component
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCartStore, useAuthStore } from '@/store';
import { formatPrice, validatePhone } from '@/lib/utils';
import { createOrder } from '@/services/orders';
import type { CheckoutFormData } from '@/types';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cash', name: 'Naqd pul', icon: Banknote },
  { id: 'card', name: 'Karta', icon: CreditCard },
  { id: 'payme', name: 'Payme', icon: Smartphone },
  { id: 'click', name: 'Click', icon: Smartphone },
];

const cities = [
  'Toshkent',
  'Samarqand',
  'Buxoro',
  'Xorazm',
  'Farg\'ona',
  'Andijon',
  'Namangan',
  'Qashqadaryo',
  'Surxondaryo',
  'Jizzax',
  'Sirdaryo',
  'Navoiy',
  'Qoraqalpog\'iston',
];

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    shipping_city: 'Toshkent',
    payment_method: 'cash',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const subtotal = getTotal();
  const shippingCost = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingCost;

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Ismingizni kiriting';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Telefon raqamni kiriting';
    } else if (!validatePhone(formData.customer_phone)) {
      newErrors.customer_phone = 'Noto\'g\'ri telefon raqam';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Manzilni kiriting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (items.length === 0) {
      toast.error('Savat bo\'sh');
      return;
    }

    setLoading(true);

    try {
      const { order, error } = await createOrder(formData, items, user?.id);

      if (error) {
        toast.error(error);
        return;
      }

      if (order) {
        clearCart();
        toast.success('Buyurtma muvaffaqiyatli qabul qilindi!');
        router.push(`/orders/${order.order_number}/success`);
      }
    } catch (err) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-6">Savat bo'sh. Avval mahsulot qo'shing.</p>
        <Link href="/products">
          <Button>Xarid qilish</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Aloqa ma'lumotlari</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Ism Familiya"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                error={errors.customer_name}
                required
              />
              <Input
                label="Telefon raqam"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                error={errors.customer_phone}
                required
              />
              <Input
                label="Email (ixtiyoriy)"
                type="email"
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Yetkazib berish manzili</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shahar/Viloyat</label>
                <select
                  value={formData.shipping_city}
                  onChange={(e) =>
                    setFormData({ ...formData, shipping_city: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="To'liq manzil"
                placeholder="Ko'cha, uy, kvartira..."
                value={formData.shipping_address}
                onChange={(e) =>
                  setFormData({ ...formData, shipping_address: e.target.value })
                }
                error={errors.shipping_address}
                required
              />
              <Input
                label="Izoh (ixtiyoriy)"
                placeholder="Qo'shimcha ma'lumot..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">To'lov usuli</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        payment_method: method.id as any,
                      })
                    }
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      formData.payment_method === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">{method.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Buyurtma</h2>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.image_url || '/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mahsulotlar</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Yetkazib berish</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Bepul</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                <span>Jami</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              Buyurtma berish
            </Button>

            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Savatga qaytish
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
