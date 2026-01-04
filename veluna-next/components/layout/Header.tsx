// =====================================================
// HEADER COMPONENT
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui';

const categories = [
  { name: 'Elektronika', slug: 'electronics' },
  { name: 'Kiyim-kechak', slug: 'fashion' },
  { name: 'Uy-ro\'zg\'or', slug: 'home' },
  { name: 'Sport', slug: 'sports' },
  { name: 'Kitoblar', slug: 'books' },
  { name: 'Go\'zallik', slug: 'beauty' },
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-primary-600 hidden sm:block">
              Veluna Market
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulotlarni qidirish..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex items-center gap-1 p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Profil</span>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <Button size="sm">Kirish</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar - Desktop */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t dark:border-gray-800">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 animate-slide-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
              />
            </div>
          </form>

          {/* Mobile Categories */}
          <nav className="px-4 pb-4">
            <p className="text-xs text-gray-500 uppercase mb-2">Kategoriyalar</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile User Actions */}
          <div className="px-4 pb-4 border-t dark:border-gray-800 pt-4">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <User className="w-6 h-6" />
                <span>Mening profilim</span>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth>Kirish</Button>
                </Link>
                <Link href="/auth/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Ro'yxatdan o'tish</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
