// =====================================================
// LOGIN PAGE
// =====================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Kirish',
  description: 'Veluna Market akkauntingizga kiring',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Akkauntga kirish</h1>
          <p className="text-gray-500 mt-2">
            Xush kelibsiz! Davom etish uchun kiring.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Akkauntingiz yo'qmi? </span>
            <Link
              href="/auth/register"
              className="text-primary-600 font-medium hover:underline"
            >
              Ro'yxatdan o'ting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
