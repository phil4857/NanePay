'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      saveAuth(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl font-display mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>N</div>
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-soft text-sm mt-1">Sign in to your NanePay account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#161210', border: '1px solid #2a211a' }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)' }}>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-soft text-sm mb-2">Email Address</label>
            <input type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl text-sm"
              style={{ background: '#1c1714', border: '1px solid #2a211a', color: '#f0e6dc' }} />
          </div>

          <div className="mb-6">
            <label className="block text-soft text-sm mb-2">Password</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className="w-full px-4 py-3.5 rounded-xl text-sm"
              style={{ background: '#1c1714', border: '1px solid #2a211a', color: '#f0e6dc' }} />
          </div>

          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-soft text-sm mt-5">
            No account?{' '}
            <Link href="/auth/register" className="text-terra hover:underline" style={{ color: '#c8602a' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
