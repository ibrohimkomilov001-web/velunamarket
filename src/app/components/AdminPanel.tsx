import { useState, useEffect } from 'react';
import { X, Package, ShoppingBag, Users, TrendingUp, Settings, Plus, Edit2, Trash2, Search, Bell, LogOut, Upload, Image as ImageIcon, DollarSign, Tag, BarChart3, Calendar, Eye, Download, Filter, UserX, UserCheck, AlertCircle, CheckCircle, Clock, Truck, XCircle, ChevronRight, MessageCircle, Send, Star, Activity, MapPin, Mail, Shield, FileText, CreditCard, Brain, Menu, Loader2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { CategoryManager } from './CategoryManager';
import { FinancialReports } from './FinancialReports';
import { InventoryManager } from './InventoryManager';
import { ReviewsModeration } from './ReviewsModeration';
import { ShippingManager } from './ShippingManager';
import { ActivityLog } from './ActivityLog';
import { EmailMarketing } from './EmailMarketing';
import { AdminManagement } from './AdminManagement';
import { DataImportExport } from './DataImportExport';
import { PaymentGateway } from './PaymentGateway';
import { AIRecommendations } from './AIRecommendations';
import { Pagination } from './Pagination';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description?: string;
  sold?: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: 'Kutilmoqda' | 'Yo\'lda' | 'Yetkazildi' | 'Bekor qilindi';
  date: string;
  time: string;
  items?: any[];
  address?: string;
  phone?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  blocked?: boolean;
}

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  description: string;
  active: boolean;
  usageCount: number;
  expiryDate: string;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
}

interface Notification {
  id: number;
  type: 'order' | 'user' | 'product' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function AdminPanel({ isOpen, onClose, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'analytics' | 'settings' | 'banners' | 'promo' | 'chat' | 'categories' | 'financial' | 'inventory' | 'reviews' | 'shipping' | 'activity' | 'email' | 'admins' | 'importexport' | 'payments' | 'ai'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // YANGI: Sidebar mobile state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // YANGI: Loading states
  const [isLoading, setIsLoading] = useState(false);
  
  // YANGI: Confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  
  // YANGI: Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // YANGI: Chat states
  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

  // Settings states
  const [siteSettings, setSiteSettings] = useState({
    phone: '+998 71 200 53 55',
    email: 'info@veluna.uz',
    address: 'Toshkent sh.',
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'electronics',
    stock: '',
    image: '',
    description: '',
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
  });

  const [promoForm, setPromoForm] = useState({
    code: '',
    discount: '',
    description: '',
    expiryDate: '',
  });

  // Load data from localStorage
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Load site settings
    const savedSettings = localStorage.getItem('veluna_site_settings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    }

    // Load products
    const savedProducts = localStorage.getItem('veluna_admin_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts: Product[] = [
        { id: 1, name: 'Apple iPhone 15 Pro Max', price: 15999000, originalPrice: 17999000, category: 'electronics', stock: 15, image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?w=300', rating: 4.8, reviews: 342, inStock: true, sold: 45, description: 'Eng yangi iPhone 15 Pro Max 256GB' },
        { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 13499000, originalPrice: 14999000, category: 'electronics', stock: 23, image: 'https://images.unsplash.com/photo-1717295248230-93ea71f48f92?w=300', rating: 4.7, reviews: 289, inStock: true, sold: 38 },
        { id: 3, name: 'Zamonaviy Kurtka', price: 450000, originalPrice: 650000, category: 'fashion', stock: 45, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=300', rating: 4.5, reviews: 156, inStock: true, sold: 67 },
        { id: 4, name: 'Yoga Matsi Professional', price: 180000, originalPrice: 250000, category: 'sports', stock: 67, image: 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?w=300', rating: 4.7, reviews: 203, inStock: true, sold: 89 },
      ];
      setProducts(initialProducts);
      localStorage.setItem('veluna_admin_products', JSON.stringify(initialProducts));
    }

    // Load orders
    const savedOrders = localStorage.getItem('veluna_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialOrders: Order[] = [
        { id: '#VL-001', customer: 'Aziz Karimov', email: 'aziz@gmail.com', product: 'iPhone 15 Pro Max', amount: 15999000, status: 'Kutilmoqda', date: '20.12.2024', time: '10:30', phone: '+998901234567', address: 'Toshkent, Mirzo Ulug\'bek tumani' },
        { id: '#VL-002', customer: 'Dilnoza Ergasheva', email: 'dilnoza@gmail.com', product: 'Samsung Galaxy S24', amount: 13499000, status: 'Yetkazildi', date: '20.12.2024', time: '09:15', phone: '+998907654321', address: 'Toshkent, Chilonzor tumani' },
        { id: '#VL-003', customer: 'Bobur Aliyev', email: 'bobur@gmail.com', product: 'Yoga Matsi', amount: 180000, status: 'Yo\'lda', date: '19.12.2024', time: '14:45', phone: '+998909876543', address: 'Samarqand shahar' },
      ];
      setOrders(initialOrders);
      localStorage.setItem('veluna_orders', JSON.stringify(initialOrders));
    }

    // Load users
    const savedUsers = localStorage.getItem('veluna_admin_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers: User[] = [
        { id: 1, name: 'Aziz Karimov', email: 'aziz@gmail.com', phone: '+998901234567', joinDate: '15.11.2024', orders: 5, totalSpent: 25000000, blocked: false },
        { id: 2, name: 'Dilnoza Ergasheva', email: 'dilnoza@gmail.com', phone: '+998907654321', joinDate: '20.11.2024', orders: 3, totalSpent: 18000000, blocked: false },
        { id: 3, name: 'Bobur Aliyev', email: 'bobur@gmail.com', phone: '+998909876543', joinDate: '25.11.2024', orders: 7, totalSpent: 32000000, blocked: false },
      ];
      setUsers(initialUsers);
      localStorage.setItem('veluna_admin_users', JSON.stringify(initialUsers));
    }

    // Load banners
    const savedBanners = localStorage.getItem('veluna_banners');
    if (savedBanners) {
      setBanners(JSON.parse(savedBanners));
    } else {
      const initialBanners: Banner[] = [
        { id: 1, title: 'Yangi yil aksiyasi 🎄', subtitle: '50% gacha chegirma - Barcha mahsulotlarga!', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', link: '', active: true, order: 1 },
        { id: 2, title: 'Smartfonlar chegirmada 📱', subtitle: 'Eng yangi modellar - 30% arzonroq', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200', link: '', active: true, order: 2 },
        { id: 3, title: 'Moda va kiyim 👗', subtitle: 'Bahorda yangi kolleksiya - 40% aksiya', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', link: '', active: true, order: 3 },
        { id: 4, title: 'Uy-ro\'zg\'or buyumlari 🏠', subtitle: 'Uyingizni yangilang - 25% chegirma', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200', link: '', active: true, order: 4 },
        { id: 5, title: 'Elektronika dunyosi 💻', subtitle: 'Noutbuk va planshetlar maxsus narxlarda', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200', link: '', active: true, order: 5 },
      ];
      setBanners(initialBanners);
      localStorage.setItem('veluna_banners', JSON.stringify(initialBanners));
    }

    // Load promo codes
    const savedPromos = localStorage.getItem('veluna_promo_codes');
    if (savedPromos) {
      setPromoCodes(JSON.parse(savedPromos));
    } else {
      const initialPromos: PromoCode[] = [
        { id: 1, code: 'WINTER2024', discount: 20, description: 'Qish mavsumi chegirmasi', active: true, usageCount: 45, expiryDate: '2024-12-31' },
        { id: 2, code: 'NEWYEAR50', discount: 50, description: 'Yangi yil maxsus', active: true, usageCount: 23, expiryDate: '2025-01-15' },
      ];
      setPromoCodes(initialPromos);
      localStorage.setItem('veluna_promo_codes', JSON.stringify(initialPromos));
    }
    
    // YANGI: Load chat list
    loadChatList();

    // Load notifications
    const savedNotifications = localStorage.getItem('veluna_admin_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const initialNotifications: Notification[] = [
        { id: 1, type: 'order', title: 'Yangi buyurtma', message: 'Aziz Karimov yangi buyurtma berdi', time: '10:30', read: false },
        { id: 2, type: 'user', title: 'Yangi foydalanuvchi', message: 'Malika Tosheva ro\'yxatdan o\'tdi', time: '09:15', read: false },
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('veluna_admin_notifications', JSON.stringify(initialNotifications));
    }
  };

  // Save to localStorage when data changes
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('veluna_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('veluna_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('veluna_admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (banners.length > 0) localStorage.setItem('veluna_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    if (promoCodes.length > 0) localStorage.setItem('veluna_promo_codes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    if (notifications.length > 0) localStorage.setItem('veluna_admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('veluna_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Statistics
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalUsers: users.length,
    todayOrders: orders.filter(o => o.date === new Date().toLocaleDateString('en-GB')).length,
    todayRevenue: orders.filter(o => o.date === new Date().toLocaleDateString('en-GB')).reduce((sum, order) => sum + order.amount, 0),
    pendingOrders: orders.filter(o => o.status === 'Kutilmoqda').length,
    completedOrders: orders.filter(o => o.status === 'Yetkazildi').length,
    unreadNotifications: notifications.filter(n => !n.read).length,
  };

  // YANGI: Chat handlers
  const loadChatList = () => {
    const allChats = JSON.parse(localStorage.getItem('veluna_all_chats') || '{}');
    const chatArray = Object.values(allChats);
    setChatList(chatArray);
  };

  const handleSelectChat = (userId: string) => {
    setSelectedChat(userId);
    const messages = JSON.parse(localStorage.getItem(`veluna_chat_${userId}`) || '[]');
    setChatMessages(messages);
    
    // Mark all user messages as read
    const allChats = JSON.parse(localStorage.getItem('veluna_all_chats') || '{}');
    if (allChats[userId]) {
      allChats[userId].unreadCount = 0;
      localStorage.setItem('veluna_all_chats', JSON.stringify(allChats));
      loadChatList();
    }
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      text: chatMessage,
      sender: 'support',
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatMessage('');
    
    // Save to localStorage
    localStorage.setItem(`veluna_chat_${selectedChat}`, JSON.stringify(updatedMessages));
    
    // Update chat list
    const allChats = JSON.parse(localStorage.getItem('veluna_all_chats') || '{}');
    if (allChats[selectedChat]) {
      allChats[selectedChat].lastMessage = newMessage.text;
      allChats[selectedChat].lastTime = newMessage.time;
      localStorage.setItem('veluna_all_chats', JSON.stringify(allChats));
      loadChatList();
    }
    
    toast.success('Xabar yuborildi!');
  };

  // Reload chat list every 5 seconds
  useEffect(() => {
    if (activeTab === 'chat') {
      const interval = setInterval(() => {
        loadChatList();
        if (selectedChat) {
          const messages = JSON.parse(localStorage.getItem(`veluna_chat_${selectedChat}`) || '[]');
          setChatMessages(messages);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedChat]);

  // Tab change handler
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset pagination
    setSearchQuery(''); // Clear search
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Confirmation Dialog Helper
  const showConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  // Product handlers
  const handleDeleteProduct = (id: number) => {
    showConfirm('Rostdan ham bu mahsulotni o\'chirmoqchimisiz?', () => {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Mahsulot o\'chirildi!');
    });
  };

  const handleBulkDeleteProducts = () => {
    if (selectedProducts.length === 0) {
      toast.error('Mahsulot tanlanmagan!');
      return;
    }
    showConfirm(`${selectedProducts.length}ta mahsulotni o'chirmoqchimisiz?`, () => {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      toast.success('Mahsulotlar o\'chirildi!');
    });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
              category: formData.category,
              stock: parseInt(formData.stock),
              image: formData.image || p.image,
              description: formData.description,
              inStock: parseInt(formData.stock) > 0,
            }
          : p
      ));
      toast.success('Mahsulot yangilandi!');
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        rating: 0,
        reviews: 0,
        inStock: parseInt(formData.stock) > 0,
        description: formData.description,
        sold: 0,
      };
      setProducts(prev => [...prev, newProduct]);
      toast.success('Mahsulot qo\'shildi!');
    }

    setFormData({ name: '', price: '', originalPrice: '', category: 'electronics', stock: '', image: '', description: '' });
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description || '',
    });
    setShowAddProduct(true);
  };

  // Order handlers
  const handleChangeOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Buyurtma holati o'zgartirildi: ${newStatus}`);
    
    // Add notification
    addNotification('order', 'Buyurtma yangilandi', `Buyurtma ${orderId} holati o'zgartirildi: ${newStatus}`);
  };

  const handleCancelOrder = (orderId: string) => {
    showConfirm('Rostdan ham buyurtmani bekor qilmoqchimisiz?', () => {
      handleChangeOrderStatus(orderId, 'Bekor qilindi');
    });
  };

  // User handlers
  const handleToggleUserBlock = (userId: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, blocked: !u.blocked } : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(user?.blocked ? 'Foydalanuvchi bloklandi!' : 'Foydalanuvchi blokdan chiqarildi!');
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Rostdan ham foydalanuvchini o\'chirmoqchimisiz?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('Foydalanuvchi o\'chirildi!');
    }
  };

  // Banner handlers
  const handleSaveBanner = () => {
    if (!bannerForm.title || !bannerForm.image) {
      toast.error('Sarlavha va rasm majburiy!');
      return;
    }

    const newBanner: Banner = {
      id: Date.now(),
      title: bannerForm.title,
      subtitle: bannerForm.subtitle,
      image: bannerForm.image,
      link: bannerForm.link,
      active: true,
      order: banners.length + 1,
    };

    setBanners(prev => [...prev, newBanner]);
    setBannerForm({ title: '', subtitle: '', image: '', link: '' });
    toast.success('Banner qo\'shildi!');
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm('Bannerni o\'chirmoqchimisiz?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      toast.success('Banner o\'chirildi!');
    }
  };

  const handleToggleBanner = (id: number) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success('Banner holati o\'zgartirildi!');
  };

  // Promo code handlers
  const handleSavePromo = () => {
    if (!promoForm.code || !promoForm.discount) {
      toast.error('Kod va chegirma majburiy!');
      return;
    }

    const newPromo: PromoCode = {
      id: Date.now(),
      code: promoForm.code.toUpperCase(),
      discount: parseFloat(promoForm.discount),
      description: promoForm.description,
      active: true,
      usageCount: 0,
      expiryDate: promoForm.expiryDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    };

    setPromoCodes(prev => [...prev, newPromo]);
    setPromoForm({ code: '', discount: '', description: '', expiryDate: '' });
    toast.success('Promokod qo\'shildi!');
  };

  const handleDeletePromo = (id: number) => {
    if (confirm('Promokodni o\'chirmoqchimisiz?')) {
      setPromoCodes(prev => prev.filter(p => p.id !== id));
      toast.success('Promokod o\'chirildi!');
    }
  };

  const handleTogglePromo = (id: number) => {
    setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    toast.success('Promokod holati o\'zgartirildi!');
  };

  // Notification handlers
  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Settings handlers
  const handleClearAllData = () => {
    if (confirm('DIQQAT! Barcha ma\'lumotlar o\'chiriladi. Davom etasizmi?')) {
      if (confirm('Bu amalni qaytarib bo\'lmaydi! Rostdan ham davom etasizmi?')) {
        localStorage.removeItem('veluna_admin_products');
        localStorage.removeItem('veluna_orders');
        localStorage.removeItem('veluna_admin_users');
        localStorage.removeItem('veluna_banners');
        localStorage.removeItem('veluna_promo_codes');
        localStorage.removeItem('veluna_admin_notifications');
        loadAllData();
        toast.success('Barcha ma\'lumotlar tozalandi!');
      }
    }
  };

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    toast.success('Eksport qilindi!');
  };

  if (!isOpen) return null;

  // Chart data - last 14 days
  const revenueData = [
    { name: '10 Dek', revenue: 1850000, orders: 12, profit: 450000 },
    { name: '11 Dek', revenue: 2100000, orders: 15, profit: 520000 },
    { name: '12 Dek', revenue: 1950000, orders: 13, profit: 480000 },
    { name: '13 Dek', revenue: 2400000, orders: 18, profit: 600000 },
    { name: '14 Dek', revenue: 2650000, orders: 20, profit: 680000 },
    { name: '15 Dek', revenue: 2200000, orders: 16, profit: 550000 },
    { name: '16 Dek', revenue: 2500000, orders: 17, profit: 625000 },
    { name: '17 Dek', revenue: 3200000, orders: 24, profit: 800000 },
    { name: '18 Dek', revenue: 2800000, orders: 21, profit: 700000 },
    { name: '19 Dek', revenue: 4100000, orders: 28, profit: 1025000 },
    { name: '20 Dek', revenue: 3500000, orders: 25, profit: 875000 },
    { name: '21 Dek', revenue: 3800000, orders: 26, profit: 950000 },
    { name: '22 Dek', revenue: 4200000, orders: 29, profit: 1050000 },
    { name: '23 Dek', revenue: stats.todayRevenue || 2900000, orders: stats.todayOrders || 22, profit: (stats.todayRevenue || 2900000) * 0.25 },
  ];

  const categoryData = [
    { name: 'Elektronika', value: products.filter(p => p.category === 'electronics').length, color: '#8B5CF6' },
    { name: 'Kiyim', value: products.filter(p => p.category === 'fashion').length, color: '#EC4899' },
    { name: 'Uy-ro\'zg\'or', value: products.filter(p => p.category === 'home').length, color: '#10B981' },
    { name: 'Sport', value: products.filter(p => p.category === 'sports').length, color: '#F59E0B' },
    { name: 'Kitoblar', value: products.filter(p => p.category === 'books').length, color: '#3B82F6' },
    { name: 'Go\'zallik', value: products.filter(p => p.category === 'beauty').length, color: '#EF4444' },
  ];

  const topProducts = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination helper
  const paginate = <T,>(array: T[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return {
      data: array.slice(startIndex, endIndex),
      totalPages: Math.ceil(array.length / perPage),
      currentPage: page,
      totalItems: array.length
    };
  };

  // Paginated data
  const paginatedProducts = paginate(filteredProducts, currentPage, itemsPerPage);
  const paginatedOrders = paginate(filteredOrders, currentPage, itemsPerPage);
  const paginatedUsers = paginate(filteredUsers, currentPage, itemsPerPage);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-[9999] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-purple-100 text-sm">Veluna Market boshqaruv tizimi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </button>

            <button 
              onClick={onLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Chiqish</span>
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute top-20 right-6 w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-10 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold dark:text-white">Bildirishnomalar</h3>
              <button onClick={markAllNotificationsAsRead} className="text-sm text-purple-600 hover:underline">
                Barchasini o'qilgan qilish
              </button>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Bildirishnomalar yo'q</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notif.read ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notif.type === 'order' ? 'bg-green-100 text-green-600' :
                        notif.type === 'user' ? 'bg-blue-100 text-blue-600' :
                        notif.type === 'product' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {notif.type === 'order' ? <Package className="w-4 h-4" /> :
                         notif.type === 'user' ? <Users className="w-4 h-4" /> :
                         notif.type === 'product' ? <ShoppingBag className="w-4 h-4" /> :
                         <Bell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium dark:text-white text-sm">{notif.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`
            w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto
            fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Close button - Mobile only */}
            <div className="lg:hidden p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold dark:text-white">Menyu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleTabChange('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Mahsulotlar</span>
                <span className="ml-auto bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buyurtmalar</span>
                <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full text-xs">
                  {stats.pendingOrders}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Foydalanuvchilar</span>
                <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('banners')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'banners'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Bannerlar</span>
              </button>

              <button
                onClick={() => handleTabChange('promo')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'promo'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Tag className="w-5 h-5" />
                <span>Promokodlar</span>
              </button>

              {/* YANGI: Chat tab */}
              <button
                onClick={() => handleTabChange('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Boshqaruvi</span>
                {chatList.reduce((sum, chat: any) => sum + (chat.unreadCount || 0), 0) > 0 && (
                  <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {chatList.reduce((sum, chat: any) => sum + (chat.unreadCount || 0), 0)}
                  </span>
                )}
              </button>

              {/* YANGI: Kategoriyalar tab */}
              <button
                onClick={() => handleTabChange('categories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'categories'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Kategoriyalar</span>
              </button>

              {/* YANGI: Moliyaviy tab */}
              <button
                onClick={() => handleTabChange('financial')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'financial'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Moliya</span>
              </button>

              {/* YANGI: Ombor tab */}
              <button
                onClick={() => handleTabChange('inventory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Ombor</span>
              </button>

              {/* YANGI: Sharhlar tab */}
              <button
                onClick={() => handleTabChange('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Sharhlar</span>
              </button>

              {/* YANGI: Yetkazib berish tab */}
              <button
                onClick={() => handleTabChange('shipping')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'shipping'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>Yetkazish</span>
              </button>

              {/* YANGI: Activity Log tab */}
              <button
                onClick={() => handleTabChange('activity')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'activity'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Harakatlar</span>
              </button>

              {/* YANGI: Email Marketing tab */}
              <button
                onClick={() => handleTabChange('email')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'email'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Email Marketing</span>
              </button>

              {/* YANGI: Admin Management tab */}
              <button
                onClick={() => handleTabChange('admins')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'admins'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Adminlar</span>
              </button>

              {/* YANGI: Import/Export tab */}
              <button
                onClick={() => handleTabChange('importexport')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'importexport'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Import/Export</span>
              </button>

              {/* YANGI: Payment Gateway tab */}
              <button
                onClick={() => handleTabChange('payments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'payments'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>To'lovlar</span>
              </button>

              {/* YANGI: AI Recommendations tab */}
              <button
                onClick={() => handleTabChange('ai')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>AI Tavsiyalar</span>
              </button>

              <button
                onClick={() => handleTabChange('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Analitika</span>
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Sozlamalar</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 opacity-80" />
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-purple-100 text-sm">Umumiy daromad</p>
                    <p className="text-2xl font-bold mt-1">{(stats.totalRevenue / 1000000).toFixed(1)}M so'm</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingBag className="w-8 h-8 opacity-80" />
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{stats.pendingOrders} kutilmoqda</span>
                    </div>
                    <p className="text-pink-100 text-sm">Buyurtmalar</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-8 h-8 opacity-80" />
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">Aktiv</span>
                    </div>
                    <p className="text-blue-100 text-sm">Mahsulotlar</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-8 h-8 opacity-80" />
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">+12 yangi</span>
                    </div>
                    <p className="text-green-100 text-sm">Foydalanuvchilar</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold dark:text-white">Daromad dinamikasi</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">So'nggi 14 kun</p>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                          <span className="text-gray-600 dark:text-gray-400">Daromad</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                          <span className="text-gray-600 dark:text-gray-400">Foyda</span>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          style={{ fontSize: '12px' }}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          style={{ fontSize: '12px' }}
                          tickLine={false}
                          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                          }}
                          formatter={(value: number, name: string) => {
                            if (name === 'revenue') return [`${(value / 1000).toLocaleString()} so'm`, 'Daromad'];
                            if (name === 'profit') return [`${(value / 1000).toLocaleString()} so'm`, 'Foyda'];
                            return [value, name];
                          }}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                          fill="url(#colorRevenue)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                          fill="url(#colorProfit)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">O'rtacha daromad</p>
                        <p className="font-bold text-purple-600 mt-1">
                          {(revenueData.reduce((a, b) => a + b.revenue, 0) / revenueData.length / 1000).toFixed(0)} ming
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Jami buyurtmalar</p>
                        <p className="font-bold text-emerald-600 mt-1">
                          {revenueData.reduce((a, b) => a + b.orders, 0)} ta
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Umumiy foyda</p>
                        <p className="font-bold text-pink-600 mt-1">
                          {(revenueData.reduce((a, b) => a + b.profit, 0) / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category Chart */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold mb-4 dark:text-white">Kategoriyalar bo'yicha</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white">Eng ko'p sotilgan mahsulotlar</h3>
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-medium dark:text-white">{product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.sold} ta sotildi</p>
                        </div>
                        <p className="font-bold text-purple-600">{(product.price / 1000).toFixed(0)}K so'm</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white">So'nggi buyurtmalar</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left py-3 dark:text-white">ID</th>
                          <th className="text-left py-3 dark:text-white">Mijoz</th>
                          <th className="text-left py-3 dark:text-white">Mahsulot</th>
                          <th className="text-left py-3 dark:text-white">Summa</th>
                          <th className="text-left py-3 dark:text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.id} className="border-b dark:border-gray-700">
                            <td className="py-3 dark:text-white">{order.id}</td>
                            <td className="py-3 dark:text-white">{order.customer}</td>
                            <td className="py-3 text-gray-600 dark:text-gray-400">{order.product}</td>
                            <td className="py-3 font-medium dark:text-white">{(order.amount / 1000).toFixed(0)}K</td>
                            <td className="py-3">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                order.status === 'Yetkazildi' ? 'bg-green-100 text-green-600' :
                                order.status === 'Yo\'lda' ? 'bg-blue-100 text-blue-600' :
                                order.status === 'Bekor qilindi' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold dark:text-white">Mahsulotlar boshqaruvi</h2>
                  <div className="flex gap-3">
                    {selectedProducts.length > 0 && (
                      <button
                        onClick={handleBulkDeleteProducts}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {selectedProducts.length}ta o'chirish
                      </button>
                    )}
                    <button
                      onClick={() => exportToCSV(products, 'mahsulotlar')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Eksport
                    </button>
                    <button
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Yangi mahsulot
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mahsulot qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Add Product Form */}
                {showAddProduct && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-500">
                    <h3 className="font-bold mb-4 dark:text-white">
                      {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Mahsulot nomi *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="Masalan: iPhone 15 Pro"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Kategoriya *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                          <option value="electronics">Elektronika</option>
                          <option value="fashion">Kiyim</option>
                          <option value="home">Uy-ro'zg'or</option>
                          <option value="sports">Sport</option>
                          <option value="books">Kitoblar</option>
                          <option value="beauty">Go'zallik</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Narx (so'm) *</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="1500000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Asl narx (so'm)</label>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="2000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Ombordagi soni *</label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 dark:text-white">Rasm URL</label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm mb-2 dark:text-white">Tavsif</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          rows={3}
                          placeholder="Mahsulot haqida ma'lumot..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveProduct}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        {editingProduct ? 'Saqlash' : 'Qo\'shish'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddProduct(false);
                          setEditingProduct(null);
                          setFormData({ name: '', price: '', originalPrice: '', category: 'electronics', stock: '', image: '', description: '' });
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                )}

                {/* Products Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="p-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts(filteredProducts.map(p => p.id));
                                } else {
                                  setSelectedProducts([]);
                                }
                              }}
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            />
                          </th>
                          <th className="text-left p-4 dark:text-white">Mahsulot</th>
                          <th className="text-left p-4 dark:text-white">Kategoriya</th>
                          <th className="text-left p-4 dark:text-white">Narx</th>
                          <th className="text-left p-4 dark:text-white">Omborda</th>
                          <th className="text-left p-4 dark:text-white">Sotildi</th>
                          <th className="text-left p-4 dark:text-white">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProducts.data.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center">
                              <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                              <p className="text-gray-500 dark:text-gray-400">Mahsulotlar topilmadi</p>
                            </td>
                          </tr>
                        ) : (
                          paginatedProducts.data.map(product => (
                            <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProducts([...selectedProducts, product.id]);
                                  } else {
                                    setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                                <div>
                                  <p className="font-medium dark:text-white">{product.name}</p>
                                  <p className="text-sm text-gray-500">ID: {product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm">
                                {product.category === 'electronics' ? 'Elektronika' :
                                 product.category === 'fashion' ? 'Kiyim' :
                                 product.category === 'home' ? 'Uy-ro\'zg\'or' :
                                 product.category === 'sports' ? 'Sport' :
                                 product.category === 'books' ? 'Kitoblar' :
                                 'Go\'zallik'}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-bold dark:text-white">{(product.price / 1000).toFixed(0)}K so'm</p>
                              {product.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">{(product.originalPrice / 1000).toFixed(0)}K</p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                product.stock > 20 ? 'bg-green-100 text-green-600' :
                                product.stock > 5 ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {product.stock} ta
                              </span>
                            </td>
                            <td className="p-4 dark:text-white">{product.sold || 0} ta</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginatedProducts.totalPages}
                    totalItems={paginatedProducts.totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    label="mahsulot"
                  />
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold dark:text-white">Buyurtmalar boshqaruvi</h2>
                  <button
                    onClick={() => exportToCSV(orders, 'buyurtmalar')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Eksport
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buyurtma yoki mijoz qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-3 flex-wrap">
                  <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                    Barchasi ({orders.length})
                  </button>
                  <button className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors">
                    Kutilmoqda ({stats.pendingOrders})
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    Yo'lda ({orders.filter(o => o.status === 'Yo\'lda').length})
                  </button>
                  <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    Yetkazildi ({stats.completedOrders})
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    Bekor qilindi ({orders.filter(o => o.status === 'Bekor qilindi').length})
                  </button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {paginatedOrders.data.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg text-center">
                      <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">Buyurtmalar topilmadi</p>
                    </div>
                  ) : (
                    paginatedOrders.data.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            order.status === 'Yetkazildi' ? 'bg-green-100 text-green-600' :
                            order.status === 'Yo\'lda' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'Bekor qilindi' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.status === 'Yetkazildi' ? <CheckCircle className="w-6 h-6" /> :
                             order.status === 'Yo\'lda' ? <Truck className="w-6 h-6" /> :
                             order.status === 'Bekor qilindi' ? <XCircle className="w-6 h-6" /> :
                             <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                            <h3 className="font-bold dark:text-white">{order.id}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer} • {order.email}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.phone}</p>
                            <p className="text-sm text-gray-500 mt-1">{order.date} - {order.time}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{(order.amount / 1000).toFixed(0)}K so'm</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.product}</p>
                        </div>
                      </div>

                      {order.address && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manzil: {order.address}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 flex-wrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleChangeOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Kutilmoqda">Kutilmoqda</option>
                          <option value="Yo'lda">Yo'lda</option>
                          <option value="Yetkazildi">Yetkazildi</option>
                          <option value="Bekor qilindi">Bekor qilindi</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Detallari
                        </button>

                        {order.status !== 'Bekor qilindi' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Bekor qilish
                          </button>
                        )}
                      </div>
                    </div>
                  )))}
                </div>
                
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginatedOrders.totalPages}
                  totalItems={paginatedOrders.totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  label="buyurtma"
                />
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold dark:text-white">Foydalanuvchilar boshqaruvi</h2>
                  <button
                    onClick={() => exportToCSV(users, 'foydalanuvchilar')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Eksport
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Foydalanuvchi qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedUsers.data.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg text-center">
                      <Users className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">Foydalanuvchilar topilmadi</p>
                    </div>
                  ) : (
                    paginatedUsers.data.map(user => (
                    <div key={user.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold dark:text-white">{user.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                        {user.blocked && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                            Bloklangan
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">📧 {user.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">📱 {user.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">📅 {user.joinDate}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Buyurtmalar</p>
                          <p className="text-xl font-bold text-purple-600">{user.orders}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Xarajat</p>
                          <p className="text-xl font-bold text-green-600">{(user.totalSpent / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ko'rish
                        </button>
                        <button
                          onClick={() => handleToggleUserBlock(user.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            user.blocked
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          }`}
                        >
                          {user.blocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          {user.blocked ? 'Aktiv' : 'Bloklash'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
                
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginatedUsers.totalPages}
                  totalItems={paginatedUsers.totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  label="foydalanuvchi"
                />
              </div>
            )}
            
            {/* Banners Tab */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Bannerlar boshqaruvi</h2>

                {/* Add Banner Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white">Yangi banner qo'shish</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Sarlavha *</label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Masalan: Yangi yil aksiyasi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Tavsif</label>
                      <input
                        type="text"
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Masalan: 50% gacha chegirma"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Rasm URL *</label>
                      <input
                        type="text"
                        value={bannerForm.image}
                        onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Havola</label>
                      <input
                        type="text"
                        value={bannerForm.link}
                        onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="/sale"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveBanner}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Banner qo'shish
                  </button>
                </div>

                {/* Banners List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map(banner => (
                    <div key={banner.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                      <div className="relative">
                        <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
                        {!banner.active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-4 py-2 bg-red-600 text-white rounded-lg">Faol emas</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold dark:text-white mb-1">{banner.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{banner.subtitle}</p>
                        {banner.link && (
                          <p className="text-sm text-purple-600 mb-3">🔗 {banner.link}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleBanner(banner.id)}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                              banner.active
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {banner.active ? 'O\'chirish' : 'Yoqish'}
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Codes Tab */}
            {activeTab === 'promo' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Promokodlar boshqaruvi</h2>

                {/* Add Promo Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white">Yangi promokod qo'shish</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Promokod *</label>
                      <input
                        type="text"
                        value={promoForm.code}
                        onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white uppercase"
                        placeholder="WINTER2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Chegirma (%) *</label>
                      <input
                        type="number"
                        value={promoForm.discount}
                        onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Tavsif</label>
                      <input
                        type="text"
                        value={promoForm.description}
                        onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Qish mavsumi chegirmasi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 dark:text-white">Amal qilish muddati</label>
                      <input
                        type="date"
                        value={promoForm.expiryDate}
                        onChange={(e) => setPromoForm({ ...promoForm, expiryDate: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSavePromo}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Promokod qo'shish
                  </button>
                </div>

                {/* Promo Codes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promoCodes.map(promo => (
                    <div key={promo.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-dashed border-purple-300 dark:border-purple-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-xl dark:text-white">{promo.code}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{promo.description}</p>
                        </div>
                        {!promo.active && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                            Faol emas
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center">
                          <p className="text-3xl font-bold">{promo.discount}%</p>
                          <p className="text-sm">Chegirma</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Ishlatildi:</span>
                          <span className="font-bold dark:text-white">{promo.usageCount} marta</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Amal qilish:</span>
                          <span className="font-bold dark:text-white">{promo.expiryDate}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePromo(promo.id)}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            promo.active
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {promo.active ? 'O\'chirish' : 'Yoqish'}
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AdvancedAnalytics 
                products={products}
                orders={orders}
                users={users}
                stats={stats}
                onExport={() => exportToCSV(orders, 'analitika')}
              />
            )}

            {/* YANGI: Chat Tab */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  Chat Boshqaruvi
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Chat List */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                      <h3 className="font-bold">Foydalanuvchilar</h3>
                      <p className="text-sm opacity-90">{chatList.length} ta suhbat</p>
                    </div>

                    <div className="divide-y dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                      {chatList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>Hali xabarlar yo'q</p>
                        </div>
                      ) : (
                        chatList.map((chat: any) => (
                          <button
                            key={chat.userId}
                            onClick={() => handleSelectChat(chat.userId)}
                            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              selectedChat === chat.userId ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium dark:text-white">{chat.userName}</p>
                              {chat.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {chat.lastMessage}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{chat.lastTime}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
                    {selectedChat ? (
                      <>
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white rounded-t-xl">
                          <h3 className="font-bold">
                            {chatList.find((c: any) => c.userId === selectedChat)?.userName}
                          </h3>
                          <p className="text-sm opacity-90">Online</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 max-h-[450px]">
                          <div className="space-y-3">
                            {chatMessages.map((msg: any) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    msg.sender === 'support'
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-white dark:bg-gray-800 border dark:border-gray-700'
                                  }`}
                                >
                                  <p className="text-sm">{msg.text}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      msg.sender === 'support' ? 'text-purple-100' : 'text-gray-500'
                                    }`}
                                  >
                                    {msg.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t dark:border-gray-700">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                              placeholder="Xabar yozing..."
                              className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              onClick={handleSendChatMessage}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <Send className="w-5 h-5" />
                              Yuborish
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>Suhbatni tanlang</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* YANGI: Kategoriyalar Tab */}
            {activeTab === 'categories' && (
              <CategoryManager />
            )}

            {/* YANGI: Moliyaviy Tab */}
            {activeTab === 'financial' && (
              <FinancialReports orders={orders} products={products} />
            )}

            {/* YANGI: Ombor Tab */}
            {activeTab === 'inventory' && (
              <InventoryManager 
                products={products}
                onUpdateProduct={(id, stock) => {
                  setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p));
                }}
              />
            )}

            {/* YANGI: Sharhlar Tab */}
            {activeTab === 'reviews' && (
              <ReviewsModeration />
            )}

            {/* YANGI: Yetkazib berish Tab */}
            {activeTab === 'shipping' && (
              <ShippingManager />
            )}

            {/* YANGI: Activity Log Tab */}
            {activeTab === 'activity' && (
              <ActivityLog />
            )}

            {/* YANGI: Email Marketing Tab */}
            {activeTab === 'email' && (
              <EmailMarketing />
            )}

            {/* YANGI: Admin Management Tab */}
            {activeTab === 'admins' && (
              <AdminManagement />
            )}

            {/* YANGI: Import/Export Tab */}
            {activeTab === 'importexport' && (
              <DataImportExport 
                products={products}
                orders={orders}
                users={users}
                onImportProducts={(importedProducts) => {
                  setProducts([...products, ...importedProducts]);
                }}
              />
            )}

            {/* YANGI: Payment Gateway Tab */}
            {activeTab === 'payments' && (
              <PaymentGateway />
            )}

            {/* YANGI: AI Recommendations Tab */}
            {activeTab === 'ai' && (
              <AIRecommendations />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Sozlamalar</h2>

                {/* Site Settings */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Sayt sozlamalari
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        📞 Telefon raqami
                      </label>
                      <input
                        type="text"
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="+998 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        📧 Email manzil
                      </label>
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="info@veluna.uz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        📍 Manzil
                      </label>
                      <input
                        type="text"
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Toshkent sh."
                      />
                    </div>
                    <button
                      onClick={() => {
                        localStorage.setItem('veluna_site_settings', JSON.stringify(siteSettings));
                        toast.success('Sozlamalar saqlandi!');
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="font-bold text-red-600">Xavfli zona</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Quyidagi amallar qaytarib bo'lmaydi. Ehtiyot bo'ling!
                  </p>
                  <button
                    onClick={handleClearAllData}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Barcha ma'lumotlarni tozalash
                  </button>
                </div>

                {/* System Info */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 dark:text-white">Tizim ma'lumotlari</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Versiya:</span>
                      <span className="font-bold dark:text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jami mahsulotlar:</span>
                      <span className="font-bold dark:text-white">{products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jami buyurtmalar:</span>
                      <span className="font-bold dark:text-white">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jami foydalanuvchilar:</span>
                      <span className="font-bold dark:text-white">{users.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Buyurtma detallari</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buyurtma ID:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedOrder.status === 'Yetkazildi' ? 'bg-green-100 text-green-600' :
                    selectedOrder.status === 'Yo\'lda' ? 'bg-blue-100 text-blue-600' :
                    selectedOrder.status === 'Bekor qilindi' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mijoz:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Telefon:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sana:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.date} {selectedOrder.time}</p>
                </div>
              </div>

              {selectedOrder.address && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yetkazib berish manzili:</p>
                  <p className="font-bold dark:text-white">{selectedOrder.address}</p>
                </div>
              )}

              <div className="border-t dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mahsulotlar:</p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-bold dark:text-white">{selectedOrder.product}</p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold dark:text-white">Jami:</p>
                  <p className="text-2xl font-bold text-purple-600">{(selectedOrder.amount / 1000).toFixed(0)}K so'm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* User Details Modal */}
        {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Foydalanuvchi detallari</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold dark:text-white">{selectedUser.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">ID: {selectedUser.id}</p>
                  {selectedUser.blocked && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      Bloklangan
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buyurtmalar</p>
                  <p className="text-3xl font-bold text-purple-600">{selectedUser.orders}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Jami xarajat</p>
                  <p className="text-3xl font-bold text-green-600">{(selectedUser.totalSpent / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-bold mb-3 dark:text-white">Aloqa ma'lumotlari</h4>
                <div className="space-y-2">
                  <p className="dark:text-white">📧 {selectedUser.email}</p>
                  <p className="dark:text-white">📱 {selectedUser.phone}</p>
                  <p className="dark:text-white">📅 Ro'yxatdan o'tgan: {selectedUser.joinDate}</p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-bold mb-3 dark:text-white">Buyurtmalar tarixi</h4>
                <div className="space-y-2">
                  {orders.filter(o => o.customer === selectedUser.name).slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">{order.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{(order.amount / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        
        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Tasdiqlash</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {confirmMessage}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Ha, o'chirish
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10001]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-300 mt-4 font-medium">Yuklanmoqda...</p>
            </div>
          </div>
        )}
      </div>
  );
}
