// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Zap,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
} from 'lucide-react'

import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import api from '@/lib/api'

type Role = 'user' | 'merchant'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultRole =
    searchParams.get('type') === 'merchant'
      ? 'merchant'
      : 'user'

  const [role, setRole] = useState<Role>(defaultRole)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
  })

  const update = (k: string, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  // ─────────────────────────────────────────────
  // PHONE NORMALIZER
  // ─────────────────────────────────────────────
  const normalizePhone = (phone: string) => {
    let p = phone.replace(/\s+/g, '').replace('+', '')

    if (p.startsWith('0')) {
      p = '254' + p.slice(1)
    }

    return p
  }

  // ─────────────────────────────────────────────
  // PASSWORD STRENGTH
  // ─────────────────────────────────────────────
  const passwordStrength = (() => {
    const p = form.password
    let s = 0

    if (p.length >= 8) s++
    if (/\d/.test(p)) s++
    if (/[A-Z]/.test(p)) s++
    if (/[^a-zA-Z0-9]/.test(p)) s++

    return s
  })()

  const strengthLabel = [
    '',
    'Weak',
    'Fair',
    'Good',
    'Strong',
  ][passwordStrength]

  // ─────────────────────────────────────────────
  // STEP VALIDATION
  // ─────────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.name.trim()) {
      toast.error('Name is required')
      return false
    }

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Valid email is required')
      return false
    }

    if (!form.phone) {
      toast.error('Phone number is required')
      return false
    }

    const cleaned = form.phone
      .replace(/\s+/g, '')
      .replace(/^\+/, '')

    const valid =
      /^0[17]\d{8}$/.test(cleaned) ||
      /^254[17]\d{8}$/.test(cleaned)

    if (!valid) {
      toast.error(
        'Use 07XXXXXXXX, 01XXXXXXXX or +254XXXXXXXXX'
      )
      return false
    }

    return true
  }

  const validateStep2 = () => {
    if (!form.password) {
      toast.error('Password is required')
      return false
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (role === 'merchant' && !form.businessName.trim()) {
      toast.error('Business name is required')
      return false
    }

    return true
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (loading) return

    if (!validateStep2()) return

    setLoading(true)

    try {
      const payload: Record<string, any> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: normalizePhone(form.phone),
        password: form.password,
        role,
      }

      if (role === 'merchant') {
        payload.businessName = form.businessName.trim()
        payload.businessType =
          form.businessType.trim() || undefined
      }

      const { data } = await api.post(
        '/auth/register',
        payload
      )

      if (data.token) {
        Cookies.set('token', data.token, {
          expires: 7,
          secure: true,
          sameSite: 'strict',
          path: '/',
        })

        toast.success('Welcome to NanePay 🎉')
        router.push('/dashboard')
      } else {
        toast.success(
          data.message || 'Account created successfully'
        )

        router.push('/auth/login')
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        'Registration failed'

      toast.error(message)

      if (
        message.toLowerCase().includes('email') ||
        message.toLowerCase().includes('phone')
      ) {
        setStep(1)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* LOGO */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-5"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="text-3xl font-black text-white">
              Nane<span className="text-green-400">Pay</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-green-200/70 mt-2 text-sm">
            Fast • Secure • Modern Payments
          </p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="bg-green-900/40 border border-green-700/40 rounded-2xl p-1 flex gap-1 mb-5 backdrop-blur">
          {(['user', 'merchant'] as Role[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setRole(r)
                setStep(1)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                role === r
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-green-200 hover:text-white'
              }`}
            >
              {r === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}

              {r === 'user'
                ? 'Personal'
                : 'Merchant'}
            </button>
          ))}
        </div>

        {/* STEP BAR */}
        <div className="flex gap-2 mb-5">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step
                  ? 'bg-green-400'
                  : 'bg-green-900'
              }`}
            />
          ))}
        </div>

        {/* CARD */}
        <div className="bg-green-900/30 border border-green-700/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

              <div>
                <label className="text-sm text-green-100 mb-2 block">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />

                  <input
                    className="w-full bg-green-950/50 border border-green-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-green-400"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e =>
                      update('name', e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-green-100 mb-2 block">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />

                  <input
                    type="email"
                    className="w-full bg-green-950/50 border border-green-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-green-400"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e =>
                      update('email', e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-green-100 mb-2 block">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />

                  <input
                    type="tel"
                    className="w-full bg-green-950/50 border border-green-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-green-400"
                    placeholder="07XXXXXXXX"
                    value={form.phone}
                    onChange={e =>
                      update('phone', e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-green-500 hover:bg-green-400 transition-all text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20"
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">

              {role === 'merchant' && (
                <div>
                  <label className="text-sm text-green-100 mb-2 block">
                    Business Name
                  </label>

                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />

                    <input
                      className="w-full bg-green-950/50 border border-green-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-green-400"
                      placeholder="My WiFi Business"
                      value={form.businessName}
                      onChange={e =>
                        update(
                          'businessName',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-green-100 mb-2 block">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />

                  <input
                    type={show ? 'text' : 'password'}
                    className="w-full bg-green-950/50 border border-green-700 rounded-xl pl-10 pr-10 py-3 text-white outline-none focus:border-green-400"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e =>
                      update('password', e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300"
                  >
                    {show ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* STRENGTH */}
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full ${
                            i <= passwordStrength
                              ? 'bg-green-400'
                              : 'bg-green-900'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-green-300">
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* CONFIRM */}
              <div>
                <label className="text-sm text-green-100 mb-2 block">
                  Confirm Password
                </label>

                <input
                  type={show ? 'text' : 'password'}
                  className="w-full bg-green-950/50 border border-green-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-400"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e =>
                    update(
                      'confirmPassword',
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-green-700 text-green-100"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-400 transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : role === 'merchant' ? (
                    'Apply as Merchant'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-green-200/70 text-sm mt-6">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
