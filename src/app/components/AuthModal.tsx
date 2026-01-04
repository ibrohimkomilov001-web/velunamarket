import { X, User, Mail, Lock, Phone } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, phone?: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.name || formData.email, formData.phone);
    onClose();
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Show success message
    setResetMessage('Parolni tiklash havolasi yuborildi! Iltimos, emailingizni tekshiring.');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setResetMessage('');
      setResetEmail('');
      setIsForgotPassword(false);
    }, 3000);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetEmail('');
    setResetMessage('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +998 prefix is always present
    if (!value.startsWith('+998')) {
      setFormData({...formData, phone: '+998 '});
    } else {
      setFormData({...formData, phone: value});
    }
  };

  return (
    <div className="fixed inset-0 w-full bg-white dark:bg-gray-800 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="dark:text-white">
          {isForgotPassword 
            ? 'Parolni tiklash' 
            : isLogin 
            ? 'Kirish' 
            : "Ro'yxatdan o'tish"}
        </h2>
        
        {/* YANGI: Desktop uchun X tugmasi */}
        <button
          onClick={onClose}
          className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Yopish"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
        {!isForgotPassword ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Ism</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button 
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3.5 md:py-3 rounded-lg hover:bg-emerald-700 transition-colors text-base md:text-sm font-medium"
              >
                {isLogin ? 'Kirish' : "Ro'yxatdan o'tish"}
              </button>
            </form>

            <div className="mt-6 text-center pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
                >
                  {isLogin ? "Ro'yxatdan o'tish" : "Kirish"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Emailingizni kiriting va biz sizga parolni tiklash havolasini yuboramiz
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                    required
                  />
                </div>
              </div>

              {resetMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    ✅ {resetMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3.5 md:py-3 rounded-lg hover:bg-emerald-700 transition-colors text-base md:text-sm"
              >
                Havolani yuborish
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 py-2"
              >
                ← Orqaga qaytish
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}