// =====================================================
// PROFILE CONTENT CLIENT COMPONENT
// =====================================================

'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button, Badge } from '@/components/ui';
import { signOut } from '@/services/auth';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

interface ProfileContentProps {
  user: User;
  profile: any;
  orders: Order[];
}

export default function ProfileContent({ user, profile, orders }: ProfileContentProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      toast.success('Tizimdan chiqdingiz');
      router.push('/');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'processing': return 'Tayyorlanmoqda';
      case 'shipped': return 'Jo\'natildi';
      case 'delivered': return 'Yetkazildi';
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary-600">
                {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="font-semibold">{profile?.full_name || 'Foydalanuvchi'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Profil ma'lumotlari
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Buyurtmalarim ({orders.length})
            </button>
          </nav>

          <hr className="my-6" />

          <Button 
            variant="outline" 
            className="w-full text-red-500 border-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            Chiqish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Profil ma'lumotlari</h3>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">To'liq ism</label>
                  <p className="font-medium">{profile?.full_name || 'Kiritilmagan'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Telefon</label>
                  <p className="font-medium">{profile?.phone || 'Kiritilmagan'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Manzil</label>
                  <p className="font-medium">{profile?.address || 'Kiritilmagan'}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button>Ma'lumotlarni tahrirlash</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Buyurtmalarim</h3>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
                <p className="text-gray-500">Buyurtmalar topilmadi</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Buyurtma #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {order.items.map((item, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {item.product_name || 'Mahsulot'} × {item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                        <span>Jami:</span>
                        <span className="text-primary-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
