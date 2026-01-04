import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BannerCarousel } from './components/BannerCarousel';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { ProductDetail } from './components/ProductDetail';
import { QuickView } from './components/QuickView';
import { AuthModal } from './components/AuthModal';
import { Checkout } from './components/Checkout';
import { OrderHistory } from './components/OrderHistory';
import { FilterBar } from './components/FilterBar';
import { Notifications } from './components/Notifications';
import { CompareProducts } from './components/CompareProducts';
import { BundleDeals } from './components/BundleDeals';
import { FAQ } from './components/FAQ';
import { Newsletter } from './components/Newsletter';
import { FlashSale } from './components/FlashSale';
import { RecommendedProducts } from './components/RecommendedProducts';
import { RecentlyViewed } from './components/RecentlyViewed';
import { BottomNav } from './components/BottomNav';
import { ReferralProgram } from './components/ReferralProgram';
import { UserProfile } from './components/UserProfile';
import { CatalogPage } from './components/CatalogPage';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { LiveChat } from './components/LiveChat'; // YANGI: LiveChat qo'shildi
import { PullToRefresh } from './components/PullToRefresh'; // YANGI: Pull to refresh
import { Toaster, toast } from 'sonner';
import velunaLogo from '../assets/baf0346f0835fb0b504a5666d91b4966fa0d97a4.png';

// Type definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[]; // YANGI: Razmerlar ro'yxati (masalan: ["S", "M", "L", "XL"] yoki ["38", "39", "40"])
  colors?: string[]; // YANGI: Ranglar ro'yxati
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // YANGI: Tanlangan razmer
  selectedColor?: string; // YANGI: Tanlangan rang
}

interface FilterOptions {
  sortBy: string;
  priceRange: { min: number; max: number };
  inStock: boolean;
}

// Bundles
const bundles = [
  {
    id: 'bundle1',
    name: 'Uy uchun to\'plam',
    products: [],
    originalPrice: 1170000,
    bundlePrice: 990000,
    discount: 15,
  },
  {
    id: 'bundle2',
    name: 'Sport to\'plami',
    products: [],
    originalPrice: 730000,
    bundlePrice: 620000,
    discount: 15,
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false); // YANGI: LiveChat uchun
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [currentLang, setCurrentLang] = useState('uz');
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'default',
    priceRange: { min: 0, max: 20000000 },
    inStock: false,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'discount' as const, title: '🔥 Katta chegirma!', message: 'Barcha elektronika mahsulotlariga 30% gacha chegirma. Shoshiling, taklif cheklangan!', date: 'Bugun, 10:30', read: false, discount: 30 },
    { id: '2', type: 'sale' as const, title: 'Yangi mahsulotlar keldi!', message: 'Eng so\'nggi Apple iPhone 15 Pro Max va Samsung Galaxy S24 Ultra sotuvda', date: 'Kecha, 15:20', read: false },
  ]);

  // Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Site settings from admin panel
  const [siteSettings, setSiteSettings] = useState({
    phone: '+998 71 200 53 55',
    email: 'info@veluna.uz',
    address: 'Toshkent sh.',
  });

  // YANGI: Dinamik mahsulotlar state
  const [products, setProducts] = useState<Product[]>([]);

  // YANGI: Load products from localStorage and sync with admin panel
  useEffect(() => {
    const savedProducts = localStorage.getItem('veluna_admin_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initial demo data
      const initialProducts: Product[] = [
        { id: 1, name: 'Apple iPhone 15 Pro Max', price: 15999000, originalPrice: 17999000, image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzY1NzkxNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'electronics', rating: 4.8, reviews: 342, inStock: true },
        { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 13499000, originalPrice: 14999000, image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzY1NzkxNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'electronics', rating: 4.7, reviews: 289, inStock: true },
        { id: 3, name: 'Zamonaviy Kurtka', price: 450000, originalPrice: 650000, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzY1Nzk0Mjc0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'fashion', rating: 4.5, reviews: 156, inStock: true },
        { id: 4, name: 'Erkaklar Ko\'ylagi Premium', price: 280000, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzY1Nzk0Mjc0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'fashion', rating: 4.3, reviews: 98, inStock: true },
        { id: 5, name: 'Uy bezagi to\'plami - Zamonaviy', price: 850000, originalPrice: 1200000, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3J8ZW58MXx8fHwxNzY1ODI0MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'home', rating: 4.6, reviews: 234, inStock: true },
        { id: 6, name: 'Dekorativ Yostiqlar (4 dona)', price: 320000, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3J8ZW58MXx8fHwxNzY1ODI0MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'home', rating: 4.4, reviews: 167, inStock: true },
        { id: 7, name: 'Yoga Matsi Professional', price: 180000, originalPrice: 250000, image: 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY1ODY3ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'sports', rating: 4.7, reviews: 203, inStock: true },
        { id: 8, name: 'Fitnes Gantellari to\'plami', price: 550000, image: 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY1ODY3ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'sports', rating: 4.5, reviews: 145, inStock: false },
        { id: 9, name: 'Bestseller Kitoblar to\'plami', price: 220000, originalPrice: 300000, image: 'https://images.unsplash.com/photo-1508060793788-7d5f1c40c4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHNoZWxmfGVufDF8fHx8MTc2NTgwMzk3Nnww&ixlib=rb-4.1.0&q=80&w=1080', category: 'books', rating: 4.9, reviews: 412, inStock: true },
        { id: 10, name: 'Badiiy Adabiyot - Klassika', price: 85000, image: 'https://images.unsplash.com/photo-1508060793788-7d5f1c40c4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHNoZWxmfGVufDF8fHx8MTc2NTgwMzk3Nnww&ixlib=rb-4.1.0&q=80&w=1080', category: 'books', rating: 4.8, reviews: 367, inStock: true },
        { id: 11, name: 'Terini parvarish qilish to\'plami', price: 420000, originalPrice: 550000, image: 'https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY1ODY1MjIwfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'beauty', rating: 4.6, reviews: 278, inStock: true },
        { id: 12, name: 'Makiyaj to\'plami Professional', price: 680000, image: 'https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzY1ODY1MjIwfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'beauty', rating: 4.7, reviews: 195, inStock: true },
      ];
      setProducts(initialProducts);
      localStorage.setItem('veluna_admin_products', JSON.stringify(initialProducts));
    }
  }, []);

  // YANGI: Listen for changes in admin panel products
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('veluna_admin_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    };

    // Listen to storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes every 500ms (for same-tab updates)
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('veluna_orders') || '[]');
    setOrders(savedOrders);
    const savedViewed = JSON.parse(localStorage.getItem('veluna_viewed') || '[]');
    setRecentlyViewed(savedViewed);
    const savedCart = JSON.parse(localStorage.getItem('veluna_cart') || '[]');
    setCartItems(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem('veluna_wishlist') || '[]');
    setWishlistItems(savedWishlist);
    const savedCompare = JSON.parse(localStorage.getItem('veluna_compare') || '[]');
    setCompareItems(savedCompare);
    const savedPhone = localStorage.getItem('veluna_user_phone');
    if (savedPhone) setUserPhone(savedPhone);
    const savedName = localStorage.getItem('veluna_user_name');
    if (savedName) setUserName(savedName);
    
    // Load site settings
    const savedSettings = localStorage.getItem('veluna_site_settings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    }

    // YANGI: Listen for openAuthModal event from UserProfile
    const handleOpenAuthModal = () => {
      setIsAuthOpen(true);
    };
    window.addEventListener('openAuthModal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // Listen for site settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('veluna_site_settings');
      if (savedSettings) {
        setSiteSettings(JSON.parse(savedSettings));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('veluna_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('veluna_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save compare items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('veluna_compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      const matchesStock = !filters.inStock || product.inStock;
      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    });

    switch (filters.sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => b.id - a.id); break;
      case 'popular': filtered.sort((a, b) => b.reviews - a.reviews); break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, filters]);

  // Get recommended products (highest rated)
  const recommendedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating);
  }, [products]);

  const handleAddToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    // Agar mahsulotda razmerlar bo'lsa va razmer tanlanmagan bo'lsa
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Iltimos, razmerni tanlang!', {
        duration: 2000,
      });
      return;
    }

    setCartItems(prev => {
      // Razmer va rang bilan bir xil mahsulotni topamiz
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        toast.success(`${product.name} miqdori oshirildi!`, {
          duration: 2000,
        });
        return prev.map(item => 
          item.id === product.id && 
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      const sizeInfo = selectedSize ? ` (${selectedSize})` : '';
      toast.success(`${product.name}${sizeInfo} savatga qo'shildi!`, {
        duration: 2000,
      });
      return [...prev, { ...product, quantity: 1, selectedSize, selectedColor }];
    });
  };

  const handleBundleAddToCart = (bundleProducts: Product[]) => {
    bundleProducts.forEach(product => handleAddToCart(product));
    toast.success('To\'plam savatga qo\'shildi!', {
      duration: 2000,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        toast.info(`${product.name} sevimlilarda olib tashlandi`, {
          duration: 2000,
        });
        return prev.filter(item => item.id !== product.id);
      }
      toast.success(`${product.name} sevimlilarga qo'shildi!`, {
        duration: 2000,
      });
      return [...prev, product];
    });
  };

  const handleAddToCompare = (product: Product) => {
    if (compareItems.length >= 4) {
      toast.error('Maksimal 4 ta mahsulotni solishtirish mumkin', {
        duration: 2000,
      });
      return;
    }
    if (compareItems.find(p => p.id === product.id)) {
      toast.info('Bu mahsulot allaqachon solishtirishda', {
        duration: 2000,
      });
      return;
    }
    setCompareItems(prev => [...prev, product]);
    toast.success(`${product.name} solishtirishga qo'shildi!`, {
        duration: 2000,
      });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem('veluna_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleLogout = () => {
    setUserName('');
    setUserPhone('');
    localStorage.removeItem('veluna_user_phone');
    localStorage.removeItem('veluna_user_name');
    setIsProfileOpen(false);
  };

  const handleLogin = (name: string, phone?: string) => {
    setUserName(name);
    localStorage.setItem('veluna_user_name', name);
    if (phone) {
      setUserPhone(phone);
      localStorage.setItem('veluna_user_phone', phone);
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // YANGI: Pull to refresh funksiyasi
  const handleRefresh = async () => {
    // Sahifani yangilash simulyatsiyasi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mahsulotlarni qayta yuklash
    const savedProducts = localStorage.getItem('veluna_admin_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    toast.success('Sahifa yangilandi!');
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0 transition-colors">
      
      {/* Show CatalogPage when activeTab is 'catalog' */}
      {activeTab === 'catalog' ? (
        <CatalogPage 
          onCategorySelect={(category) => {
            setSelectedCategory(category);
            setActiveTab('home');
          }}
          onBackToHome={() => setActiveTab('home')}
        />
      ) : (
        <>
          {/* Main Home Page */}
          <Header 
            cartItemCount={totalCartItems}
            wishlistCount={wishlistItems.length}
            notificationCount={unreadNotifications}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
            onAuthClick={() => setIsAuthOpen(true)}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            onProfileClick={() => setIsProfileOpen(true)}
            onSearchChange={setSearchQuery}
            userName={userName}
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onAdminClick={() => setShowAdminLogin(true)}
            onLiveChatClick={() => setLiveChatOpen(true)} // YANGI: LiveChat tugmasi
          />
          
          <BannerCarousel 
            onStartShopping={() => {
              // Scroll to products section
              const productsSection = document.querySelector('section');
              productsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            onViewCategories={() => setActiveTab('catalog')}
          />

          <FlashSale 
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />

          <RecommendedProducts 
            products={recommendedProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />

          {recentlyViewed.length > 0 && (
            <RecentlyViewed 
              products={recentlyViewed}
              onProductClick={handleProductClick}
            />
          )}

          <section className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl mb-1 dark:text-white">
                  {selectedCategory === 'all' ? 'Barcha mahsulotlar' : 'Tanlangan kategoriya'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {filteredProducts.length} mahsulot topildi
                </p>
              </div>
              <div className="flex gap-2">
                <FilterBar activeFilters={filters} onFilterChange={setFilters} />
                {compareItems.length > 0 && (
                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="relative px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
                  >
                    Solishtirish ({compareItems.length})
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Mahsulot topilmadi</p>
                <p className="text-sm mt-2">Filterni o'zgartiring yoki boshqa kategoriya tanlang</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onProductClick={handleProductClick}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlistItems.some(item => item.id === product.id)}
                    onQuickView={handleQuickView}
                    onAddToCompare={handleAddToCompare}
                  />
                ))}
              </div>
            )}
          </section>

          <BundleDeals bundles={bundles} onAddToCart={handleBundleAddToCart} />

          <FAQ />

          <Newsletter />

          <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-emerald-400 mb-4">Veluna Market</h3>
                  <p className="text-gray-400 text-sm">Eng yaxshi mahsulotlar eng qulay narxlarda. Ishonch bilan xarid qiling!</p>
                </div>
                <div>
                  <h4 className="mb-4">Ma'lumot</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-emerald-400">Biz haqimizda</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Yetkazib berish</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Qaytarish</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Kontaktlar</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4">Kategoriyalar</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-emerald-400">Elektronika</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Kiyim</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Uy-ro'zg'or</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Sport</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4">Bog'lanish</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>Tel: {siteSettings.phone}</li>
                    <li>Email: {siteSettings.email}</li>
                    <li>Manzil: {siteSettings.address}</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                © 2024 Veluna Market. Barcha huquqlar himoyalangan.
                {/* Hidden Admin Access - Click 5 times */}
                <button
                  onClick={() => {
                    const newCount = logoClickCount + 1;
                    setLogoClickCount(newCount);
                    if (newCount >= 5) {
                      setShowAdminLogin(true);
                      setLogoClickCount(0);
                    }
                  }}
                  className="ml-2 opacity-10 hover:opacity-20 transition-opacity"
                >
                  •
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      <BottomNav 
        activeTab={activeTab}
        onTabChange={(tab) => {
          // Avval barcha modallarni yopamiz
          setIsWishlistOpen(false);
          setIsProfileOpen(false);
          setIsCartOpen(false);
          setIsCatalogOpen(false);
          setIsAuthOpen(false); // AuthModal ham yopiladi
          
          // Keyin yangi tabni ochib, activeTab ni o'zgartiramiz
          setActiveTab(tab);
          
          // Faqat 'home' tab bo'lmasa, modal ochish
          if (tab === 'cart') {
            setIsCartOpen(true);
          } else if (tab === 'wishlist') {
            setIsWishlistOpen(true);
          } else if (tab === 'catalog') {
            setIsCatalogOpen(true);
          } else if (tab === 'profile') {
            userName ? setIsProfileOpen(true) : setIsAuthOpen(true);
          }
        }}
        cartItemCount={totalCartItems}
        wishlistCount={wishlistItems.length}
        isCheckoutOpen={isCheckoutOpen}
      />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={(id, qty, selectedSize, selectedColor) => setCartItems(prev => prev.map(item => 
          item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: qty } 
            : item
        ))} 
        onRemoveItem={(id, selectedSize, selectedColor) => setCartItems(prev => prev.filter(item => 
          !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
        ))} 
        onCheckout={() => setIsCheckoutOpen(true)} 
      />

      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={wishlistItems} onRemoveItem={(id) => setWishlistItems(prev => prev.filter(item => item.id !== id))} onAddToCart={handleAddToCart} />

      <ProductDetail product={selectedProduct} isOpen={isProductDetailOpen} onClose={() => setIsProductDetailOpen(false)} onAddToCart={handleAddToCart} allProducts={products} onProductClick={handleProductClick} />

      <QuickView product={quickViewProduct} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isInWishlist={quickViewProduct ? wishlistItems.some(item => item.id === quickViewProduct.id) : false} onViewDetails={handleProductClick} />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />

      <Checkout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cartItems} onClearCart={() => setCartItems([])} userPhone={userPhone} userName={userName} />

      <OrderHistory isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} orders={orders} />

      <Notifications isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} />

      <CompareProducts isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} products={compareItems} onRemove={(id) => setCompareItems(prev => prev.filter(p => p.id !== id))} />

      <ReferralProgram isOpen={isReferralOpen} onClose={() => setIsReferralOpen(false)} userName={userName || 'User'} />

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userName={userName} 
        userPhone={userPhone} 
        onLogout={handleLogout} 
        onOpenOrders={() => { setIsProfileOpen(false); setIsOrderHistoryOpen(true); }} 
        onOpenReferral={() => { setIsProfileOpen(false); setIsReferralOpen(true); }} 
        onProfileUpdate={(name, phone) => { setUserName(name); setUserPhone(phone); }}
        onAdminClick={() => {
          setIsProfileOpen(false);
          setShowAdminLogin(true);
        }}
      />
      
      {/* Admin Login Modal */}
      {showAdminLogin && !isAdminLoggedIn && (
        <AdminLogin
          onLogin={() => {
            setIsAdminLoggedIn(true);
          }}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && isAdminLoggedIn && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            setShowAdminPanel(false);
            localStorage.removeItem('veluna_admin_logged_in');
            toast.info('Admin paneldan chiqildi');
          }}
        />
      )}
      
      <Toaster />
      <LiveChat 
        userName={userName || 'Mehmon'}
        userId={userPhone || 'guest'}
        externalOpen={liveChatOpen}
        onExternalOpenChange={setLiveChatOpen}
      /> {/* YANGI: LiveChat qo'shildi */}
    </div>
    </PullToRefresh>
  );
}