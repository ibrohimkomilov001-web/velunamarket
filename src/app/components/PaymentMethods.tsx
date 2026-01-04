import { CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';
import paymeLogoImg from 'figma:asset/6a7d848ff81da8bb8fe154e7f4b7124c852cb03f.png';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onPaymentComplete?: () => void;
}

export function PaymentMethods({ selectedMethod, onMethodChange, onPaymentComplete }: PaymentMethodsProps) {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cardType: 'humo',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/[^0-9]/g, '');
    value = value.substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\//g, '');
    value = value.replace(/[^0-9]/g, '');
    value = value.substring(0, 4);
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setCardData({ ...cardData, expiryDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
  };

  const handleCardPaymentClick = () => {
    // Validate card data
    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      alert('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
  };

  const handleClickPayment = () => {
    setIsProcessing(true);
    // Simulate Click payment
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 1500);
  };

  const handlePaymePayment = () => {
    setIsProcessing(true);
    // Simulate Payme payment
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Payment method selection */}
      <div className="space-y-3">
        {/* Cash */}
        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={selectedMethod === 'cash'}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-5 h-5 text-emerald-600"
          />
          <div className="flex-1">
            <p className="dark:text-white">💵 Naqd pul</p>
            <p className="text-xs text-gray-500">Yetkazib berishda to'lash</p>
          </div>
        </label>

        {/* Card Payment */}
        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-5 h-5 text-emerald-600"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 dark:text-white" />
              <p className="dark:text-white">Plastik karta</p>
            </div>
            <div className="flex gap-2 mt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Old_Visa_Logo.svg/200px-Old_Visa_Logo.svg.png" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" className="h-6" />
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded">Humo</span>
              <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs rounded">UzCard</span>
            </div>
          </div>
        </label>

        {/* Click */}
        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="click"
            checked={selectedMethod === 'click'}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-5 h-5 text-emerald-600"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <p className="dark:text-white">Click</p>
            </div>
            <p className="text-xs text-gray-500">Click mobil ilovasi orqali to'lash</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
        </label>

        {/* Payme */}
        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="payme"
            checked={selectedMethod === 'payme'}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-5 h-5 text-emerald-600"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-5 h-5 text-cyan-600" />
              <p className="dark:text-white">Payme</p>
            </div>
            <p className="text-xs text-gray-500">Payme mobil ilovasi orqali to'lash</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            <img src={paymeLogoImg} alt="Payme" className="h-6" />
          </div>
        </label>
      </div>

      {/* Card payment form */}
      {selectedMethod === 'card' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
          <h4 className="dark:text-white mb-4">Karta ma'lumotlari</h4>
          
          {/* Card Type */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Karta turi</label>
            <select
              value={cardData.cardType}
              onChange={(e) => setCardData({ ...cardData, cardType: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="humo">Humo</option>
              <option value="uzcard">UzCard</option>
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
            </select>
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Karta raqami</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardData.cardNumber}
              onChange={handleCardNumberChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Karta egasi</label>
            <input
              type="text"
              placeholder="ISM FAMILIYA"
              value={cardData.cardHolder}
              onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Amal qilish muddati</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={handleExpiryChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cardData.cvv}
                onChange={handleCvvChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCardPaymentClick}
            disabled={isProcessing}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? '⏳ To\'lov amalga oshirilmoqda...' : '💳 Kartadan to\'lash'}
          </button>
        </div>
      )}

      {/* Click payment */}
      {selectedMethod === 'click' && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-3xl font-bold">C</span>
            </div>
            <h4 className="dark:text-white mb-2">Click orqali to'lash</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click mobil ilovasida to'lovni tasdiqlang
            </p>
          </div>
          <button
            onClick={handleClickPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? '⏳ Click ilovasiga yo\'naltirilmoqda...' : '📱 Click orqali to\'lash'}
          </button>
        </div>
      )}

      {/* Payme payment */}
      {selectedMethod === 'payme' && (
        <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <img src={paymeLogoImg} alt="Payme" className="h-6" />
            </div>
            <h4 className="dark:text-white mb-2">Payme orqali to'lash</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payme mobil ilovasida to'lovni tasdiqlang
            </p>
          </div>
          <button
            onClick={handlePaymePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? '⏳ Payme ilovasiga yo\'naltirilmoqda...' : '📱 Payme orqali to\'lash'}
          </button>
        </div>
      )}

      {/* Security info */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <p className="text-sm text-green-900 dark:text-green-100 font-medium">Xavfsiz to'lov</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Barcha to'lovlar SSL shifrlash orqali himoyalangan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}