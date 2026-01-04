import { Users, Copy, Check, Gift, X } from 'lucide-react';
import { useState } from 'react';

interface ReferralProgramProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function ReferralProgram({ isOpen, onClose, userName }: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);
  const referralCode = `VELUNA${userName.toUpperCase().slice(0, 3)}2024`;
  const referralLink = `https://veluna.uz/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div 
          className="bg-white dark:bg-gray-800 w-full md:max-w-2xl md:rounded-lg rounded-t-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* YANGI: Desktop X tugmasi */}
          <div className="hidden md:flex justify-end p-4 pb-0">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Yopish"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 pt-2 md:pt-0">{/* text-center mb-6 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2">Do'stlaringizni taklif qiling!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Har bir do'stingiz uchun 50,000 so'm bonus oling
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3>Siz uchun</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Do'stingiz ro'yxatdan o'tgandan so'ng 50,000 so'm bonus
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h3>Do'stingiz uchun</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Birinchi xaridga 20% chegirma
                </p>
              </div>
            </div>

            {/* Referral code */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
                Sizning referral kodingiz
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg"
                />
                <button
                  onClick={handleCopy}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="hidden md:inline">{copied ? 'Nusxa olindi' : 'Nusxa olish'}</span>
                </button>
              </div>
            </div>

            {/* Link */}
            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
                Yoki linkni ulashing
              </label>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg break-all text-sm">
                {referralLink}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-2xl mb-1">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Taklif qilingan</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-2xl mb-1">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Faol</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-2xl text-emerald-600 mb-1">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Bonus (so'm)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}