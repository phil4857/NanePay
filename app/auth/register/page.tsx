// app/auth/register/page.tsx  ← REPLACEMENT
'use client'
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
