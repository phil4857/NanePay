// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Zap,
  Loader2,
  Mail,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const res = await authAPI.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      saveAuth(res.data.token, res.data.user, res.data.wallet)
      toast.success('Welcome back!')

      router.push('/dashboard')
    } catch (err: any) {
      const data = err.response?.data

      toast.error(
        data?.error ||
        data?.reason ||
        data?.message ||
        'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-green">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="font-display font-bold text-2xl text-white">
              Nane<span className="gradient-text">Pay</span>
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-white">
            Welcome back
          </h1>

          <p className="text-brand-muted mt-1 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="label">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">
                  Password
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-brand-green hover:text-primary-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type={show ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {show
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3.5 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-brand-muted text-sm mt-6">
          Don't have an account?{' '}

          <Link
            href="/auth/register"
            className="text-brand-green hover:text-primary-400 font-medium transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
