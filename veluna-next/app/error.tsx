// =====================================================
// ERROR STATE
// =====================================================

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Xatolik yuz berdi</h2>
        <p className="text-gray-500 mb-6">
          Nimadir noto'g'ri ketdi. Iltimos, qaytadan urinib ko'ring.
        </p>
        <Button onClick={reset}>Qayta urinish</Button>
      </div>
    </div>
  );
}
