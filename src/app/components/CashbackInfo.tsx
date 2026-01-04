import { Wallet, TrendingUp, Gift } from 'lucide-react';

interface CashbackInfoProps {
  totalCashback: number;
  currentOrder?: number;
}

export function CashbackInfo({ totalCashback, currentOrder }: CashbackInfoProps) {
  const cashbackPercent = 5;
  const orderCashback = currentOrder ? Math.floor(currentOrder * (cashbackPercent / 100)) : 0;

  return (
    <div className="space-y-3">
      {/* Total cashback */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600" />
            <span className="text-sm">Sizning cashback balansingiz</span>
          </div>
          <TrendingUp className="w-4 h-4 text-purple-600" />
        </div>
        <p className="text-2xl text-purple-600 mb-1">
          {totalCashback.toLocaleString()} so'm
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Keyingi xaridda ishlatishingiz mumkin
        </p>
      </div>

      {/* Current order cashback */}
      {currentOrder && currentOrder > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            <span className="text-sm">Bu buyurtmadan cashback</span>
          </div>
          <p className="text-xl text-emerald-600 mb-1">
            +{orderCashback.toLocaleString()} so'm
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {cashbackPercent}% cashback barcha xaridlarga
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        💡 <span className="font-semibold">Qanday ishlaydi:</span> Har bir xariddan {cashbackPercent}% cashback oling va keyingi xaridlaringizda ishlating!
      </div>
    </div>
  );
}
