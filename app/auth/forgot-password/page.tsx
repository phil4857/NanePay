// app/auth/forgot-password/page.tsx  ← NEW FILE
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Zap, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-green">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Nane<span className="gradient-text">Pay</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">
            {sent ? 'Check your inbox' : 'Reset your password'}
          </h1>
          <p className="text-brand-muted mt-1 text-sm">
            {sent ? `We sent a reset link to ${email}` : 'Enter your email and we\'ll send a reset link'}
          </p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-brand-green" />
              </div>
              <p className="text-gray-300 text-sm">Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-brand-green hover:underline">try again</button>.
              </p>
              <Link href="/auth/login" className="btn-primary w-full text-center py-3 mt-2">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input type="email" className="input-field pl-10" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3.5">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <Link href="/auth/login" className="flex items-center justify-center gap-2 text-brand-muted hover:text-white text-sm mt-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  )
}
