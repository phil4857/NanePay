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
  ShieldCheck,
} from 'lucide-react'

import toast from 'react-hot-toast'
import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

type Role = 'user' | 'merchant'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultRole =
    searchParams.get('type') === 'merchant'
      ? 'merchant'
      : 'user'

  const [role, setRole] = useState<Role>(defaultRole)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    referralCode: '',
  })

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  })

  const [loading, setLoading] = useState(false)
  const [agree, setAgree] = useState(false)

  const update = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  // ─────────────────────────────────────────────
  // Password Strength
  // ─────────────────────────────────────────────
  const getPasswordStrength = () => {
    let score = 0

    if (form.password.length >= 8) score++
    if (/\d/.test(form.password)) score++
    if (/[A-Z]/.test(form.password)) score++
    if (/[^a-zA-Z0-9]/.test(form.password)) score++

    return score
  }

  const strength = getPasswordStrength()

  const strengthLabel =
    strength >= 4
      ? 'Strong'
      : strength >= 3
      ? 'Good'
      : strength >= 2
      ? 'Fair'
      : 'Weak'

  const strengthColor =
    strength >= 4
      ? 'bg-green-500'
      : strength >= 3
      ? 'bg-yellow-500'
      : strength >= 2
      ? 'bg-orange-500'
      : 'bg-red-500'

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────
  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault()

    if (!form.name.trim()) {
      return toast.error('Full name is required')
    }

    if (!form.email.trim()) {
      return toast.error('Email is required')
    }

    if (!form.phone.trim()) {
      return toast.error('Phone number is required')
    }

    if (form.password.length < 8) {
      return toast.error(
        'Password must be at least 8 characters'
      )
    }

    if (!/\d/.test(form.password)) {
      return toast.error(
        'Password must contain at least one number'
      )
    }

    if (!/[A-Z]/.test(form.password)) {
      return toast.error(
        'Password must contain at least one uppercase letter'
      )
    }

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }

    if (role === 'merchant' && !form.businessName.trim()) {
      return toast.error(
        'Business name is required for merchants'
      )
    }

    if (!agree) {
      return toast.error(
        'You must accept the Terms & Privacy Policy'
      )
    }

    setLoading(true)

    try {
      const res = await authAPI.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role,
        businessName:
          role === 'merchant'
            ? form.businessName.trim()
            : undefined,
        referralCode: form.referralCode.trim() || undefined,
      })

      // Auto login after registration
      if (res?.data?.token && res?.data?.user) {
        saveAuth(res.data.token, res.data.user)
      }

      toast.success('Account created successfully')

      router.push('/dashboard')

    } catch (err: any) {

      const data = err?.response?.data

      if (data?.errors && Array.isArray(data.errors)) {
        toast.error(
          data.errors
            .map((e: any) => e.message)
            .join(', ')
        )
      } else {
        toast.error(
          data?.message ||
            data?.error ||
            data?.reason ||
            'Registration failed. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-green">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="font-display font-bold text-2xl text-white">
              Nane<span className="gradient-text">Pay</span>
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-white">
            Create your account
          </h1>

          <p className="text-brand-muted mt-1 text-sm">
            Free forever. Secure onboarding with M-Pesa support.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="card p-1 flex gap-1 mb-5">

          {(['user', 'merchant'] as Role[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                role === r
                  ? 'bg-brand-green text-white shadow-glow-sm'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {r === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}

              {r === 'user'
                ? 'Personal Account'
                : 'Merchant / ISP'}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="card p-8">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            {/* Name */}
            <div>
              <label className="label">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e =>
                    update('name', e.target.value)
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e =>
                    update('email', e.target.value)
                  }
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                Phone Number (M-Pesa)
              </label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type="tel"
                  className="input-field pl-10"
                  placeholder="0712345678"
                  value={form.phone}
                  onChange={e =>
                    update('phone', e.target.value)
                  }
                />
              </div>

              <p className="text-xs text-brand-muted mt-1">
                Format: 0712345678 or 254712345678
              </p>
            </div>

            {/* Merchant */}
            {role === 'merchant' && (
              <div>
                <label className="label">
                  Business Name
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="My Hotspot Business"
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

            {/* Referral */}
            <div>
              <label className="label">
                Referral Code (Optional)
              </label>

              <input
                type="text"
                className="input-field"
                placeholder="Enter referral code"
                value={form.referralCode}
                onChange={e =>
                  update(
                    'referralCode',
                    e.target.value
                  )
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type={
                    show.password
                      ? 'text'
                      : 'password'
                  }
                  className="input-field pl-10 pr-10"
                  placeholder="Min 8 chars with uppercase & number"
                  value={form.password}
                  onChange={e =>
                    update(
                      'password',
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShow(prev => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
                >
                  {show.password ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Strength */}
              {form.password.length > 0 && (
                <div className="mt-3">

                  <div className="flex gap-1 mb-2">

                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= strength
                            ? strengthColor
                            : 'bg-brand-border'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-muted">
                      Password strength
                    </span>

                    <span className="text-white font-medium">
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="label">
                Confirm Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />

                <input
                  type={
                    show.confirm
                      ? 'text'
                      : 'password'
                  }
                  className={`input-field pl-10 pr-10 ${
                    form.confirmPassword
                      ? form.confirmPassword ===
                        form.password
                        ? 'border-green-500'
                        : 'border-red-500'
                      : ''
                  }`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e =>
                    update(
                      'confirmPassword',
                      e.target.value
                    )
                  }
                  onKeyDown={e =>
                    e.key === 'Enter' &&
                    handleSubmit()
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShow(prev => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
                >
                  {show.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {form.confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    form.confirmPassword ===
                    form.password
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {form.confirmPassword ===
                  form.password
                    ? '✅ Passwords match'
                    : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={e =>
                  setAgree(e.target.checked)
                }
                className="mt-1"
              />

              <span className="text-xs text-brand-muted leading-relaxed">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-brand-green hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-brand-green hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />

                  {role === 'merchant'
                    ? 'Apply as Merchant'
                    : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-brand-muted text-sm mt-6">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-brand-green hover:text-primary-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
