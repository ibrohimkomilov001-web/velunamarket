import { X, MapPin, CreditCard, Truck, User, Phone, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CartItem } from './Cart';
import { PromoCode } from './PromoCode';
import { CashbackInfo } from './CashbackInfo';
import { PaymentMethods } from './PaymentMethods';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  userPhone?: string;
  userName?: string;
}

export function Checkout({ isOpen, onClose, items, onClearCart, userPhone, userName }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: userName || '',
    phone: userPhone || '+998 ',
    address: '',
    city: '',
    paymentMethod: 'cash',
    deliveryType: 'standard', // Yangi: yetkazib berish turi
  });
  const [promoCode, setPromoCode] = useState<string>();
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [totalCashback] = useState(150000);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // YANGI: Yetkazib berish narxlari va vaqtlari
  const deliveryOptions = {
    tashkent: {
      express: { days: '1 kun', price: 50000 },
      standard: { days: '2-3 kun', price: 20000 },
      economy: { days: '4-5 kun', price: 10000 },
    },
    samarkand: {
      express: { days: '1-2 kun', price: 70000 },
      standard: { days: '3-4 kun', price: 35000 },
      economy: { days: '5-7 kun', price: 20000 },
    },
    bukhara: {
      express: { days: '1-2 kun', price: 70000 },
      standard: { days: '3-4 kun', price: 35000 },
      economy: { days: '5-7 kun', price: 20000 },
    },
    andijan: {
      express: { days: '1-2 kun', price: 65000 },
      standard: { days: '3-5 kun', price: 35000 },
      economy: { days: '5-7 kun', price: 20000 },
    },
    namangan: {
      express: { days: '1-2 kun', price: 65000 },
      standard: { days: '3-5 kun', price: 35000 },
      economy: { days: '5-7 kun', price: 20000 },
    },
    fergana: {
      express: { days: '1-2 kun', price: 65000 },
      standard: { days: '3-5 kun', price: 35000 },
      economy: { days: '5-7 kun', price: 20000 },
    },
  };

  // YANGI: Yetkazib berish narxini hisoblash
  const getDeliveryInfo = () => {
    if (!formData.city || !formData.deliveryType) {
      return { days: '2-3 kun', price: 25000 }; // Default
    }
    const cityOptions = deliveryOptions[formData.city as keyof typeof deliveryOptions];
    return cityOptions?.[formData.deliveryType as keyof typeof cityOptions] || { days: '2-3 kun', price: 25000 };
  };

  const deliveryInfo = getDeliveryInfo();
  const deliveryFee = deliveryInfo.price;

  // Update phone when userPhone changes
  useEffect(() => {
    if (userPhone && userPhone !== formData.phone) {
      setFormData(prev => ({...prev, phone: userPhone}));
    }
  }, [userPhone]);

  // Update name when userName changes
  useEffect(() => {
    if (userName && userName !== formData.name) {
      setFormData(prev => ({...prev, name: userName}));
    }
  }, [userName]);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoDiscountAmount = Math.floor(total * (promoDiscount / 100));
  const subtotal = total - promoDiscountAmount;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete order and save to history
      const newOrder = {
        id: Math.floor(Math.random() * 100000).toString(),
        date: new Date().toLocaleDateString('uz-UZ', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        status: 'pending' as const,
        total: subtotal,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      
      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('veluna_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('veluna_orders', JSON.stringify(existingOrders));
      
      // YANGI: Send notification to Telegram
      sendTelegramNotification(newOrder, formData);
      
      setStep(4);
      setTimeout(() => {
        onClearCart();
        onClose();
        setStep(1);
        setPromoCode(undefined);
        setPromoDiscount(0);
      }, 3000);
    }
  };

  // YANGI: Telegram notification function
  const sendTelegramNotification = async (order: any, customerInfo: any) => {
    const TELEGRAM_BOT_TOKEN = '7827567734:AAE_rnTv-9Bm2UL2PFhkIxdPiNIxqyoUHoI';
    const TELEGRAM_CHAT_ID = '7227550519';

    const itemsList = order.items.map((item: any) => 
      `  • ${item.name} x${item.quantity} - ${(item.price / 1000).toLocaleString()} so'm`
    ).join('\n');

    const message = `
🛒 *YANGI BUYURTMA!* 🛒

📦 *Buyurtma ID:* #${order.id}
📅 *Sana:* ${order.date}

👤 *Mijoz ma'lumotlari:*
  • Ism: ${customerInfo.name}
  • Telefon: ${customerInfo.phone}
  • Manzil: ${customerInfo.address}, ${customerInfo.city}

🛍️ *Mahsulotlar:*
${itemsList}

💰 *Jami summa:* ${(order.total / 1000).toLocaleString()} so'm
💳 *To'lov usuli:* ${customerInfo.paymentMethod === 'cash' ? 'Naqd pul' : customerInfo.paymentMethod === 'card' ? 'Karta' : customerInfo.paymentMethod === 'uzcard' ? 'Uzcard' : 'Humo'}

✅ *Status:* Kutilmoqda
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  };

  const handleApplyPromo = (code: string, discount: number) => {
    setPromoCode(code);
    setPromoDiscount(discount);
  };

  const handleRemovePromo = () => {
    setPromoCode(undefined);
    setPromoDiscount(0);
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 overflow-y-auto backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <div className="min-h-screen flex items-end md:items-center justify-center p-0 md:p-4">
          <div 
            className="bg-white dark:bg-gray-800 w-full md:max-w-2xl md:rounded-lg rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b dark:border-gray-700">
              <h2 className="dark:text-white">To'lovni rasmiylashtirish</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            {/* Success state */}
            {step === 4 ? (
              <div className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-green-600 mb-2">Buyurtma qabul qilindi!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Buyurtma raqami: #{Math.floor(Math.random() * 100000)}
                </p>
                <p className="text-sm text-gray-500">
                  Tez orada siz bilan bog'lanamiz
                </p>
              </div>
            ) : (
              <>
                {/* Steps indicator */}
                <div className="flex justify-center gap-2 p-4 md:p-6 border-b dark:border-gray-700">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        s <= step ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}>
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`w-12 md:w-20 h-0.5 ${
                          s < step ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Contact Info */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 mb-4 dark:text-white">
                          <User className="w-5 h-5" />
                          Shaxsiy ma'lumotlar
                        </h3>
                        
                        <div>
                          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Ism familiya</label>
                          <input
                            type="text"
                            placeholder="Ismingizni kiriting"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                            required
                          />
                        </div>

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
                      </div>
                    )}

                    {/* Step 2: Delivery Address */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 mb-4 dark:text-white">
                          <MapPin className="w-5 h-5" />
                          Yetkazib berish manzili
                        </h3>

                        <div>
                          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Shahar</label>
                          <select
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base md:text-sm"
                            required
                          >
                            <option value="">Shaharni tanlang</option>
                            <option value="tashkent">Toshkent</option>
                            <option value="samarkand">Samarqand</option>
                            <option value="bukhara">Buxoro</option>
                            <option value="andijan">Andijon</option>
                            <option value="namangan">Namangan</option>
                            <option value="fergana">Farg'ona</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">To'liq manzil</label>
                          <textarea
                            placeholder="Ko'cha, uy raqami, kvartira"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-base md:text-sm"
                            required
                          />
                        </div>

                        {/* Yetkazib berish turini tanlash */}
                        {formData.city && (
                          <div>
                            <label className="block text-sm mb-3 text-gray-700 dark:text-gray-300">
                              Yetkazib berish turini tanlang
                            </label>
                            <div className="space-y-2">
                              {/* Tezkor yetkazish */}
                              <label 
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  formData.deliveryType === 'express' 
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="deliveryType"
                                    value="express"
                                    checked={formData.deliveryType === 'express'}
                                    onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                                    className="w-4 h-4 text-emerald-600"
                                  />
                                  <div>
                                    <p className="font-medium dark:text-white">⚡ Tezkor yetkazish</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.express?.days}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium text-emerald-600">
                                  {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.express?.price.toLocaleString()} so'm
                                </span>
                              </label>

                              {/* Standart yetkazish */}
                              <label 
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  formData.deliveryType === 'standard' 
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="deliveryType"
                                    value="standard"
                                    checked={formData.deliveryType === 'standard'}
                                    onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                                    className="w-4 h-4 text-emerald-600"
                                  />
                                  <div>
                                    <p className="font-medium dark:text-white">🚚 Standart yetkazish</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.standard?.days}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium text-emerald-600">
                                  {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.standard?.price.toLocaleString()} so'm
                                </span>
                              </label>

                              {/* Tejamkor yetkazish */}
                              <label 
                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  formData.deliveryType === 'economy' 
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    name="deliveryType"
                                    value="economy"
                                    checked={formData.deliveryType === 'economy'}
                                    onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                                    className="w-4 h-4 text-emerald-600"
                                  />
                                  <div>
                                    <p className="font-medium dark:text-white">📦 Tejamkor yetkazish</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.economy?.days}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium text-emerald-600">
                                  {deliveryOptions[formData.city as keyof typeof deliveryOptions]?.economy?.price.toLocaleString()} so'm
                                </span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Yetkazib berish haqida ma'lumot */}
                        {formData.city && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
                            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-blue-900 dark:text-blue-100">
                                Yetkazib berish: {deliveryInfo.days}
                              </p>
                              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                Narxi: {deliveryFee.toLocaleString()} so'm
                              </p>
                            </div>
                          </div>
                        )}

                        {!formData.city && (
                          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex gap-3">
                            <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Shaharni tanlang va yetkazib berish turini ko'ring
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Payment & Confirmation */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 mb-4 dark:text-white">
                          <CreditCard className="w-5 h-5" />
                          To'lov usuli
                        </h3>

                        {/* Promo Code */}
                        <PromoCode
                          onApply={handleApplyPromo}
                          appliedCode={promoCode}
                          onRemove={handleRemovePromo}
                        />

                        {/* Cashback Info */}
                        <CashbackInfo
                          totalCashback={totalCashback}
                          currentOrder={subtotal}
                        />

                        <PaymentMethods
                          selectedMethod={formData.paymentMethod}
                          onMethodChange={(method) => setFormData({...formData, paymentMethod: method})}
                          onPaymentComplete={() => {
                            // Payment completed successfully - complete the order
                            const newOrder = {
                              id: Math.floor(Math.random() * 100000).toString(),
                              date: new Date().toLocaleDateString('uz-UZ', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              }),
                              status: 'pending' as const,
                              total: subtotal,
                              items: items.map(item => ({
                                id: item.id,
                                name: item.name,
                                image: item.image,
                                price: item.price,
                                quantity: item.quantity,
                              })),
                            };
                            
                            // Save to localStorage
                            const existingOrders = JSON.parse(localStorage.getItem('veluna_orders') || '[]');
                            existingOrders.unshift(newOrder);
                            localStorage.setItem('veluna_orders', JSON.stringify(existingOrders));
                            
                            setStep(4);
                            setTimeout(() => {
                              onClearCart();
                              onClose();
                              setStep(1);
                              setPromoCode(undefined);
                              setPromoDiscount(0);
                            }, 3000);
                          }}
                        />

                        {/* Order summary */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 mt-6">
                          <h4 className="mb-3 dark:text-white">Buyurtma tafsilotlari</h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Mahsulotlar ({items.length})</span>
                            <span className="dark:text-white">{total.toLocaleString()} so'm</span>
                          </div>
                          {promoDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Promo kod ({promoCode})</span>
                              <span>-{promoDiscountAmount.toLocaleString()} so'm</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Yetkazib berish</span>
                            <span className="dark:text-white">{deliveryFee.toLocaleString()} so'm</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <span className="dark:text-white">Jami</span>
                            <span className="text-emerald-600 text-xl">
                              {grandTotal.toLocaleString()} so'm
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer buttons */}
                    <div className="flex gap-3 mt-6">
                      {step > 1 && step < 3 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-3.5 md:py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Orqaga
                        </button>
                      )}
                      {step < 3 && (
                        <button
                          type="submit"
                          className="flex-1 bg-emerald-600 text-white py-3.5 md:py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Davom etish
                        </button>
                      )}
                      {step === 3 && formData.paymentMethod === 'cash' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-3.5 md:py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Orqaga
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-emerald-600 text-white py-3.5 md:py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Buyurtma berish
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}