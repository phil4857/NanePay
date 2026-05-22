// app/auth/register/page.tsx  ← REPLACEMENT
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Zap, Loader2, Mail, Lock, User, Phone, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import Cookies from 'js-cookie'

type Role = 'user' | 'merchant'

export default function RegisterPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const defaultRole  = (searchParams.get('type') === 'merchant' ? 'merchant' : 'user') as Role

  const [role,    setRole]    = useState<Role>(defaultRole)
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState({
    name: '', email: '', phone: '', password: '',
    confirmPassword: '', businessName: '', businessType: '',
  })

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

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
    // Accept 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
    const cleaned = form.phone.replace(/\s+/g, '').replace(/^\+/, '')
    const valid = /^0[17]\d{8}$/.test(cleaned) || /^254[17]\d{8}$/.test(cleaned)
    if (!valid) {
      toast.error('Enter a valid phone: 07XXXXXXXX, 01XXXXXXXX or +254XXXXXXXXX')
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
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    setLoading(true)
    try {
      const payload: Record<string, any> = {
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.trim(),
        password: form.password,
        role,
      }
      if (role === 'merchant') {
        payload.businessName = form.businessName.trim()
        payload.businessType = form.businessType.trim() || undefined
      }

      const { data } = await api.post('/auth/register', payload)

      // If backend returns token directly, save it
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' })
        toast.success('Account created! Welcome to NanePay 🎉')
        router.push('/dashboard')
      } else {
        toast.success(data.message || 'Account created! Please sign in.')
        router.push('/auth/login')
      }

    } catch (err: any) {
      // Show the REAL error from backend, not a generic message
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        'Registration failed. Please try again.'

      toast.error(message)

      // If it's a validation error, go back to step 1
      const msg = message.toLowerCase()
      if (
        msg.includes('phone') ||
        msg.includes('email') ||
        msg.includes('name')
      ) {
        setStep(1)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
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
          <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
          <p className="text-brand-muted mt-1 text-sm">Free forever · No hidden fees</p>
        </div>

        {/* Role toggle */}
        <div className="card p-1 flex gap-1 mb-5">
          {(['user', 'merchant'] as Role[]).map(r => (
            <button key={r} onClick={() => { setRole(r); setStep(1) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                role === r
                  ? 'bg-brand-green text-white shadow-glow-sm'
                  : 'text-brand-muted hover:text-white'
              }`}>
              {r === 'user' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              {r === 'user' ? 'Personal Account' : 'Merchant / ISP'}
            </button>
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-brand-green' : 'bg-brand-border'
            }`} />
          ))}
          <span className="text-brand-muted text-xs ml-1">Step {step}/2</span>
        </div>

        {/* Card */}
        <div className="card p-8">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-brand-muted text-sm font-medium">Personal Info</p>

              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input className="input-field pl-10" placeholder="John Doe"
                    value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input type="email" className="input-field pl-10" placeholder="you@example.com"
                    value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input type="tel" className="input-field pl-10"
                    placeholder="07XXXXXXXX or +254XXXXXXXXX"
                    value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <p className="text-brand-muted text-xs mt-1.5">
                  Format: 07XXXXXXXX · 01XXXXXXXX · +254XXXXXXXXX
                </p>
              </div>

              <button onClick={handleContinue} className="btn-primary py-3.5 mt-1">
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-brand-muted text-sm font-medium">
                {role === 'merchant' ? 'Business & Security' : 'Set Password'}
              </p>

              {role === 'merchant' && (
                <div>
                  <label className="label">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input className="input-field pl-10" placeholder="My Hotspot Business"
                      value={form.businessName} onChange={e => update('businessName', e.target.value)} />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type={show ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type={show ? 'text' : 'password'}
                    className="input-field pl-10"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                  />
                </div>
              </div>

              <p className="text-xs text-brand-muted">
                By signing up you agree to our{' '}
                <Link href="/terms" className="text-brand-green hover:underline">Terms</Link>
                {' '}&{' '}
                <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="btn-secondary px-4 py-3.5">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                    : role === 'merchant' ? 'Apply as Merchant' : 'Create Account'
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-brand-muted text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-green hover:text-primary-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
