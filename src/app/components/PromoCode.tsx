import { Tag, Check, X } from 'lucide-react';
import { useState } from 'react';

interface PromoCodeProps {
  onApply: (code: string, discount: number) => void;
  appliedCode?: string;
  onRemove: () => void;
}

const promoCodes = [
  { code: 'CHEGIRMA30', discount: 30, description: '30% chegirma barcha mahsulotlarga' },
  { code: 'YANGI20', discount: 20, description: '20% yangi foydalanuvchilar uchun' },
  { code: 'YOZGI15', discount: 15, description: '15% yozgi chegirma' },
  { code: 'BEPUL10', discount: 10, description: '10% har qanday xaridga' },
];

export function PromoCode({ onApply, appliedCode, onRemove }: PromoCodeProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleApply = () => {
    const promo = promoCodes.find(p => p.code === code.toUpperCase());
    if (promo) {
      onApply(promo.code, promo.discount);
      setError('');
      setShowSuggestions(false);
    } else {
      setError('Noto\'g\'ri promo kod');
    }
  };

  return (
    <div className="space-y-3">
      {!appliedCode ? (
        <>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Promo kod"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
              />
            </div>
            <button
              onClick={handleApply}
              className="px-6 py-3 md:py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Qo'llash
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          {/* Promo code suggestions */}
          {showSuggestions && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-sm mb-2">Mavjud promo kodlar:</p>
              <div className="space-y-2">
                {promoCodes.map((promo) => (
                  <button
                    key={promo.code}
                    onClick={() => {
                      setCode(promo.code);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left p-2 bg-white rounded hover:bg-emerald-50 transition-colors text-sm"
                  >
                    <span className="font-mono text-emerald-600">{promo.code}</span>
                    <span className="text-gray-600 ml-2">- {promo.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm">Promo kod qo'llandi</p>
              <p className="font-mono text-green-600">{appliedCode}</p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-green-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-green-700" />
          </button>
        </div>
      )}
    </div>
  );
}
