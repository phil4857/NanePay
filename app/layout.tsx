// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'NanePay — Fast. Secure. Connected.',
    template: '%s | NanePay',
  },
  description: 'NanePay is a modern fintech platform for seamless payments, internet packages, and merchant services — powered by M-Pesa.',
  keywords: ['NanePay', 'payments', 'fintech', 'M-Pesa', 'internet packages', 'hotspot', 'Kenya'],
  authors: [{ name: 'NanePay' }],
  themeColor: '#00C853',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: 'NanePay',
    title: 'NanePay — Fast. Secure. Connected.',
    description: 'Modern fintech platform for payments, internet packages, and merchant services.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid #1F2937',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00C853', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
