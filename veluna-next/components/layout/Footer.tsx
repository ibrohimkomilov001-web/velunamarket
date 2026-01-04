// =====================================================
// FOOTER COMPONENT
// =====================================================

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';

const categories = [
  { name: 'Elektronika', slug: 'electronics' },
  { name: 'Kiyim-kechak', slug: 'fashion' },
  { name: 'Uy-ro\'zg\'or', slug: 'home' },
  { name: 'Sport', slug: 'sports' },
];

const pages = [
  { name: 'Biz haqimizda', href: '/about' },
  { name: 'Yetkazib berish', href: '/delivery' },
  { name: 'Qaytarish', href: '/returns' },
  { name: 'Aloqa', href: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-white">Veluna Market</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Eng yaxshi mahsulotlar eng qulay narxlarda. Ishonch bilan xarid qiling!
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriyalar</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ma'lumot</h3>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bog'lanish</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary-500" />
                <a href="tel:+998712005355" className="hover:text-primary-400">
                  +998 71 200 53 55
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-primary-500" />
                <a href="mailto:info@veluna.uz" className="hover:text-primary-400">
                  info@veluna.uz
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>Toshkent sh., Chilonzor tumani</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} Veluna Market. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary-400">
                Maxfiylik siyosati
              </Link>
              <Link href="/terms" className="hover:text-primary-400">
                Foydalanish shartlari
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
