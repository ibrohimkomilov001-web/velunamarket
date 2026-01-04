import { ShoppingCart, Search, User, Menu, Heart, Bell, Moon, Sun, Globe, Shield, MessageCircle } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import velunaLogo from 'figma:asset/baf0346f0835fb0b504a5666d91b4966fa0d97a4.png';

interface HeaderProps {
  cartItemCount: number;
  wishlistCount: number;
  notificationCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onAuthClick: () => void;
  onNotificationClick: () => void;
  onSearchChange: (query: string) => void;
  onProfileClick?: () => void;
  userName?: string;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onAdminClick?: () => void;
  onLiveChatClick?: () => void; // YANGI: Live Chat uchun
}

export function Header({ 
  cartItemCount, 
  wishlistCount, 
  notificationCount,
  onCartClick, 
  onWishlistClick, 
  onAuthClick, 
  onNotificationClick,
  onSearchChange,
  onProfileClick,
  userName,
  currentLang,
  onLanguageChange,
  onAdminClick,
  onLiveChatClick // YANGI
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src={velunaLogo} 
              alt="Veluna Market" 
              className="h-8 md:h-10 w-auto cursor-pointer object-contain"
            />
            <h1 className="text-emerald-600 dark:text-emerald-400 cursor-pointer text-base md:text-2xl font-semibold">
              Veluna Market
            </h1>
            {/* Admin Access Button - Desktop only */}
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-xs"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSelector 
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
            />
            
            <button 
              onClick={onNotificationClick}
              className="hidden md:block relative hover:text-emerald-600 transition-colors p-2"
            >
              <Bell className="w-6 h-6 dark:text-white" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={userName && onProfileClick ? onProfileClick : onAuthClick}
              className="hidden md:flex items-center gap-2 hover:text-emerald-600 transition-colors p-2"
            >
              <User className="w-6 h-6 dark:text-white" />
              <span className="hidden lg:inline dark:text-white">{userName || 'Kirish'}</span>
            </button>
            
            <button 
              onClick={onWishlistClick}
              className="hidden md:block relative hover:text-emerald-600 transition-colors p-2"
            >
              <Heart className="w-6 h-6 dark:text-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={onCartClick}
              className="hidden md:block relative hover:text-emerald-600 transition-colors p-2 active:scale-95 transition-transform"
            >
              <ShoppingCart className="w-6 h-6 dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}