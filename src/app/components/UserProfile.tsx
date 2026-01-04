import { X, User, MapPin, CreditCard, Settings, LogOut, Package, Gift, Moon, Sun, Camera, Edit2, Trash2, Plus, Check, Shield, Bell, Mail, Smartphone, Globe, Lock, Eye, EyeOff, Star, Award, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userPhone: string; // YANGI: Telefon raqam
  onLogout: () => void;
  onOpenOrders: () => void;
  onOpenReferral: () => void;
  onProfileUpdate?: (name: string, phone: string) => void; // YANGI: Profil yangilanganda callback
  onAdminClick?: () => void; // YANGI: Admin panel ochish uchun
}

interface Address {
  id: string;
  label: string;
  fullAddress: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

export function UserProfile({ isOpen, onClose, userName, userPhone, onLogout, onOpenOrders, onOpenReferral, onProfileUpdate, onAdminClick }: UserProfileProps) {
  const [activeSection, setActiveSection] = useState('main');
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Profile states
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: 'user@veluna.uz',
    phone: userPhone,
    birthday: '1990-01-01',
    gender: 'male'
  });
  const [avatar, setAvatar] = useState('');

  // YANGI: userName va userPhone o'zgarganda profileData'ni yangilash
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      name: userName || prev.name,
      phone: userPhone || prev.phone
    }));
  }, [userName, userPhone]);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullAddress: '',
    phone: ''
  });

  // Card states
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: ''
  });

  // Settings states
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    promoEmails: true,
    orderUpdates: true
  });

  // Security states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Statistics from localStorage
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cashback: 0,
    bonusPoints: 0
  });

  // Load data from localStorage
  useEffect(() => {
    if (isOpen) {
      // YANGI: Avatar'ni localStorage'dan yuklash
      const savedAvatar = localStorage.getItem('veluna_avatar');
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }

      // Load addresses
      const savedAddresses = localStorage.getItem('veluna_addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }

      // Load cards
      const savedCards = localStorage.getItem('veluna_cards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }

      // Load settings
      const savedSettings = localStorage.getItem('veluna_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Load profile
      const savedProfile = localStorage.getItem('veluna_profile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }

      // Calculate statistics
      const orders = JSON.parse(localStorage.getItem('veluna_orders') || '[]');
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      setStats({
        totalOrders: orders.length,
        totalSpent,
        cashback: Math.floor(totalSpent * 0.05), // 5% cashback
        bonusPoints: orders.length * 10
      });
    }
  }, [isOpen]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !isDarkMode;
    
    if (newMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkMode(newMode);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        localStorage.setItem('veluna_avatar', reader.result as string);
        toast.success('Avatar o\'zgartirildi!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('veluna_profile', JSON.stringify(profileData));
    localStorage.setItem('veluna_user_name', profileData.name);
    setEditMode(false);
    toast.success('Profil saqlandi!');
    if (onProfileUpdate) {
      onProfileUpdate(profileData.name, profileData.phone);
    }
  };

  // Address functions
  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.fullAddress || !newAddress.phone) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, address];
    setAddresses(updated);
    localStorage.setItem('veluna_addresses', JSON.stringify(updated));
    setNewAddress({ label: '', fullAddress: '', phone: '' });
    setShowAddressForm(false);
    toast.success('Manzil qo\'shildi!');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('veluna_addresses', JSON.stringify(updated));
    toast.success('Manzil o\'chirildi!');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('veluna_addresses', JSON.stringify(updated));
    toast.success('Asosiy manzil o\'rnatildi!');
  };

  // Card functions
  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const card: PaymentCard = {
      id: Date.now().toString(),
      ...newCard,
      isDefault: cards.length === 0
    };

    const updated = [...cards, card];
    setCards(updated);
    localStorage.setItem('veluna_cards', JSON.stringify(updated));
    setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '' });
    setShowCardForm(false);
    toast.success('Karta qo\'shildi!');
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    localStorage.setItem('veluna_cards', JSON.stringify(updated));
    toast.success('Karta o\'chirildi!');
  };

  const handleSetDefaultCard = (id: string) => {
    const updated = cards.map(c => ({ ...c, isDefault: c.id === id }));
    setCards(updated);
    localStorage.setItem('veluna_cards', JSON.stringify(updated));
    toast.success('Asosiy karta o\'rnatildi!');
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('Parollar mos kelmaydi!');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }

    // Simulate password change
    toast.success('Parol muvaffaqiyatli o\'zgartirildi!');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('veluna_settings', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const menuItems = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'addresses', label: 'Manzillar', icon: MapPin },
    { id: 'cards', label: 'Kartalarim', icon: CreditCard },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 w-full bg-white dark:bg-gray-800 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        {activeSection === 'main' ? (
          <>
            <h2 className="dark:text-white">Shaxsiy kabinet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setActiveSection('main')} 
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>
          </>
        )}
      </div>

      {/* Main Menu or Section Content */}
      {activeSection === 'main' ? (
        <>
          {/* Profile Header with Stats */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-800 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl mb-1">{profileData.name || 'Foydalanuvchi'}</h3>
                <p className="text-emerald-100 text-sm">{profileData.email}</p>
                <p className="text-emerald-100 text-sm">{profileData.phone}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                <Package className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-xl mb-1">{stats.totalOrders}</p>
                <p className="text-xs text-emerald-100">Buyurtmalar</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-xl mb-1">{(stats.totalSpent / 1000).toFixed(0)}K</p>
                <p className="text-xs text-emerald-100">Xarajat</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                <Star className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-xl mb-1">{(stats.cashback / 1000).toFixed(0)}K</p>
                <p className="text-xs text-emerald-100">Cashback</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                <Award className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <p className="text-xl mb-1">{stats.bonusPoints}</p>
                <p className="text-xs text-emerald-100">Bonuslar</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pb-24">
            {/* Quick actions */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onOpenOrders();
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Package className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-sm dark:text-white">Buyurtmalar</p>
                    <p className="text-xs text-gray-500">Tarixni ko'rish</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenReferral();
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Gift className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="text-sm dark:text-white">Taklif qilish</p>
                    <p className="text-xs text-purple-600">Bonus oling</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="p-4">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3 px-2">SOZLAMALAR</h3>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="dark:text-white">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout Button - Inside Scrollable Area */}
            <div className="p-4 space-y-3">
              {/* Admin Panel Button */}
              {onAdminClick && (
                <button
                  onClick={() => {
                    onAdminClick();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin Panel</span>
                </button>
              )}

              {userName ? (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Chiqish</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    // AuthModal ochish uchun event
                    window.dispatchEvent(new CustomEvent('openAuthModal'));
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Kirish</span>
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        // Section Content
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="dark:text-white">Shaxsiy ma'lumotlar</h3>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  {editMode ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {editMode ? 'Saqlash' : 'Tahrirlash'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Ism Familiya</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Telefon</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Tug'ilgan kun</label>
                  <input
                    type="date"
                    value={profileData.birthday}
                    onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Jins</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    disabled={!editMode}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  >
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Section */}
          {activeSection === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="dark:text-white">Yetkazib berish manzillari</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Yangi manzil
                </button>
              </div>

              {showAddressForm && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Manzil nomi (masalan: Uy, Ish)"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="To'liq manzil"
                    value={newAddress.fullAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon raqam"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Saqlash
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Manzillar qo'shilmagan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg border-2 ${
                        address.isDefault
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium dark:text-white">{address.label}</span>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">Asosiy</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{address.fullAddress}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{address.phone}</p>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-sm text-emerald-600 hover:underline"
                        >
                          Asosiy qilish
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cards Section */}
          {activeSection === 'cards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="dark:text-white">To'lov kartalari</h3>
                <button
                  onClick={() => setShowCardForm(!showCardForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Yangi karta
                </button>
              </div>

              {showCardForm && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Karta raqami (16 raqam)"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, '').slice(0, 16) })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Karta egasi"
                    value={newCard.cardHolder}
                    onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Amal qilish muddati (MM/YY)"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCard}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Saqlash
                    </button>
                    <button
                      onClick={() => setShowCardForm(false)}
                      className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              {cards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Kartalar qo'shilmagan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 rounded-lg border-2 ${
                        card.isDefault
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-700 to-gray-600'
                      } text-white`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <CreditCard className="w-8 h-8 opacity-80" />
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-white hover:text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xl tracking-wider mb-4">
                        {card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs opacity-70">Karta egasi</p>
                          <p className="text-sm">{card.cardHolder}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-70">Amal qilish</p>
                          <p className="text-sm">{card.expiryDate}</p>
                        </div>
                      </div>
                      {card.isDefault && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <span className="text-xs">✓ Asosiy to'lov kartasi</span>
                        </div>
                      )}
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefaultCard(card.id)}
                          className="mt-3 text-sm hover:underline"
                        >
                          Asosiy qilish
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="dark:text-white mb-4">Xavfsizlik sozlamalari</h3>

              {/* Change Password */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="dark:text-white">Parolni o'zgartirish</p>
                      <p className="text-sm text-gray-500">Xavfsizligingizni ta'minlang</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 dark:text-white transition-transform ${showPasswordChange ? 'rotate-90' : ''}`} />
                </button>

                {showPasswordChange && (
                  <div className="mt-4 space-y-3 pt-4 border-t dark:border-gray-700">
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Joriy parol"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white pr-12"
                      />
                      <button
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="Yangi parol"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white pr-12"
                      />
                      <button
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Parolni tasdiqlang"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white pr-12"
                      />
                      <button
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Parolni yangilash
                    </button>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="dark:text-white">Ikki bosqichli autentifikatsiya</p>
                      <p className="text-sm text-gray-500">Qo'shimcha xavfsizlik darajasi</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    Yoqish
                  </button>
                </div>
              </div>

              {/* Login History */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <p className="dark:text-white">Kirish tarixi</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Bugun, 14:30</span>
                    <span className="dark:text-white">Web Browser</span>
                  </div>
                  <div className="flex justify-between py-2 border-b dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Kecha, 09:15</span>
                    <span className="dark:text-white">Mobile App</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-4">
              <h3 className="dark:text-white mb-4">Sozlamalar</h3>

              {/* Notifications */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                <h4 className="dark:text-white mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  Bildirishnomalar
                </h4>

                <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="text-sm dark:text-white">Push bildirishnomalar</span>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                    className="w-5 h-5 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="text-sm dark:text-white">Email bildirishnomalar</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                    className="w-5 h-5 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="text-sm dark:text-white">SMS xabarnomalar</span>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingsChange('smsNotifications', e.target.checked)}
                    className="w-5 h-5 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="text-sm dark:text-white">Promo aksiyalar</span>
                  <input
                    type="checkbox"
                    checked={settings.promoEmails}
                    onChange={(e) => handleSettingsChange('promoEmails', e.target.checked)}
                    className="w-5 h-5 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                  <span className="text-sm dark:text-white">Buyurtma yangiliklari</span>
                  <input
                    type="checkbox"
                    checked={settings.orderUpdates}
                    onChange={(e) => handleSettingsChange('orderUpdates', e.target.checked)}
                    className="w-5 h-5 text-emerald-600"
                  />
                </label>
              </div>

              {/* Theme */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                    <span className="text-sm dark:text-white">Tungi rejim</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">{isDarkMode ? 'Yoqilgan' : "O'chirilgan"}</span>
                </button>
              </div>

              {/* Language */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm dark:text-white">Til</span>
                  </div>
                  <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg text-sm">
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}