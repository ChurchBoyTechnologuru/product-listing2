// Root layout component with providers and global styles

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Listing',
  description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
  keywords: ['marketplace', 'international', 'ecommerce', 'global', 'shipping'],
  authors: [{ name: 'Marketplace Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'International Marketplace',
    description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Marketplace',
    description: 'Connect international sellers with local consumers. Sell globally, ship locally.',
  },
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
