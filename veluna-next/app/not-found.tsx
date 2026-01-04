// =====================================================
// NOT FOUND PAGE (404)
// =====================================================

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Sahifa topilmadi</h2>
        <p className="text-gray-500 mb-8">
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </p>
        <Link href="/">
          <Button size="lg">Bosh sahifaga qaytish</Button>
        </Link>
      </div>
    </div>
  );
}
