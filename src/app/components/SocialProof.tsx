import { Users, Eye, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialProofProps {
  productId: number;
}

export function SocialProof({ productId }: SocialProofProps) {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 20) + 5);
  const [recentPurchases, setRecentPurchases] = useState(Math.floor(Math.random() * 10) + 3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 20) + 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {/* Live viewers */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Eye className="w-4 h-4 text-blue-600 animate-pulse" />
        <span><strong>{viewers}</strong> kishi hozir ko'rmoqda</span>
      </div>

      {/* Recent purchases */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Users className="w-4 h-4 text-green-600" />
        <span><strong>{recentPurchases}</strong> kishi bugun xarid qildi</span>
      </div>

      {/* Trending */}
      <div className="flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-orange-600" />
        <span className="text-orange-600 font-medium">🔥 Mashhur mahsulot</span>
      </div>
    </div>
  );
}
