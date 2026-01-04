// =====================================================
// ADMIN LOGIN PAGE
// =====================================================

import { Metadata } from 'next';
import AdminLoginForm from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Kirish | Veluna Market',
  description: 'Veluna Market admin paneliga kirish',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-600">Veluna Admin</h1>
            <p className="text-gray-500 mt-2">Admin paneliga kirish</p>
          </div>
          
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
