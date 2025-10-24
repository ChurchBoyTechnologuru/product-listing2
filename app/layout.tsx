// Root layout component with providers and global styles

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Product Listing',
  description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
  keywords: ['marketplace', 'international', 'ecommerce', 'global', 'shipping'],
  authors: [{ name: 'Marketplace Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'International Marketplace',
    description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'International Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    
    title: 'International Marketplace',
    description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
    images: ['/og-image.jpg'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
