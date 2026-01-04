import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery?: string;
}

export function OrderTracking({ orderId, status, estimatedDelivery }: OrderTrackingProps) {
  const steps = [
    { id: 'pending', label: 'Qabul qilindi', icon: Package },
    { id: 'processing', label: 'Tayyorlanmoqda', icon: Package },
    { id: 'shipped', label: 'Yo\'lda', icon: Truck },
    { id: 'delivered', label: 'Yetkazildi', icon: CheckCircle },
  ];

  const statusIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="dark:text-white">Buyurtma #{orderId}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {estimatedDelivery && `Yetkaziladi: ${estimatedDelivery}`}
          </p>
        </div>
        <MapPin className="w-6 h-6 text-emerald-600" />
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
        <div 
          className="absolute top-5 left-0 h-1 bg-emerald-600 transition-all duration-500"
          style={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= statusIndex;
            const isCurrent = index === statusIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-200 dark:ring-emerald-900' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs text-center ${
                  isCompleted ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'shipped' && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            📦 Buyurtmangiz yo'lda! Yetkazib beruvchi: Alibek (+998 90 000 00 00)
          </p>
        </div>
      )}

      {status === 'delivered' && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-900 dark:text-green-100">
            ✅ Buyurtma muvaffaqiyatli yetkazildi! Rahmat!
          </p>
        </div>
      )}
    </div>
  );
}
