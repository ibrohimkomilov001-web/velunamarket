// =====================================================
// REGISTER PAGE
// =====================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Ro\'yxatdan o\'tish',
  description: 'Veluna Market da ro\'yxatdan o\'ting',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Ro'yxatdan o'tish</h1>
          <p className="text-gray-500 mt-2">
            Yangi akkuant yarating
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Akkauntingiz bormi? </span>
            <Link
              href="/auth/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Kirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
