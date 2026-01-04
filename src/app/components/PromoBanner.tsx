import { X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Chegirma vaqti tugayapti!</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
              <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-sm">🔥 Barcha mahsulotlarga 30% gacha chegirma!</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
