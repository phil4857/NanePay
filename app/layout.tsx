import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NanePay — Your Money, Your Power',
  description: 'Send, receive, invest and exchange money across East Africa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-pattern min-h-screen">
        {children}
      </body>
    </html>
  )
}
