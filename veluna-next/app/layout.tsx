// =====================================================
// ROOT LAYOUT
// =====================================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Header, Footer } from '@/components/layout';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: {
    default: 'Veluna Market - Onlayn do\'kon',
    template: '%s | Veluna Market',
  },
  description:
    'Veluna Market - O\'zbekistondagi eng yaxshi onlayn do\'kon. Elektronika, kiyim-kechak, uy-ro\'zg\'or va boshqa mahsulotlar.',
  keywords: [
    'online shop',
    'market',
    'uzbekistan',
    'electronics',
    'fashion',
    'veluna',
  ],
  authors: [{ name: 'Veluna Team' }],
  creator: 'Veluna',
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://veluna.uz',
    siteName: 'Veluna Market',
    title: 'Veluna Market - Onlayn do\'kon',
    description:
      'O\'zbekistondagi eng yaxshi onlayn do\'kon. Qulay narxlar va tez yetkazib berish.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Veluna Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veluna Market',
    description: 'Onlayn do\'kon - qulay narxlar va tez yetkazib berish',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
