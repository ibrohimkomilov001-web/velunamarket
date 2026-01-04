import { Home, ShoppingCart, Heart, User, Grid3x3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
  wishlistCount: number;
  isCheckoutOpen?: boolean;
}

export function BottomNav({ activeTab, onTabChange, cartItemCount, wishlistCount, isCheckoutOpen = false }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Bosh sahifa' },
    { id: 'catalog', icon: Grid3x3, label: 'Katalog' },
    { id: 'wishlist', icon: Heart, label: 'Sevimlilar', count: wishlistCount },
    { id: 'cart', icon: ShoppingCart, label: 'Savat', count: cartItemCount },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  // Agar checkout ochiq bo'lsa, navigatsiyani yashiramiz
  if (isCheckoutOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg md:hidden z-[60] safe-area-bottom">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.count !== undefined && tab.count > 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {showBadge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}