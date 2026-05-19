// app/auth/register/page.tsx  ← REPLACEMENT
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Zap, Loader2, Mail, Lock, User, Phone, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { register } from '@/lib/auth'

type Role = 'user' | 'merchant'

export default function RegisterPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const defaultRole  = (searchParams.get('type') === 'merchant' ? 'merchant' : 'user') as Role

  const [role, setRole]   = useState<Role>(defaultRole)
  const [show, setShow]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm]   = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    businessName: '', businessType: '',
  })

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (role === 'merchant' && !form.businessName) {
      toast.error('Business name is required for merchants')
      return
    }
    setLoading(true)
    try {
      await register({ ...form, role })
      toast.success('Account created! Please check your email.')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.')
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
            <span className="font-display font-bold text-2xl text-white">Nane<span className="gradient-text">Pay</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
          <p className="text-brand-muted mt-1 text-sm">Start for free, no credit card required</p>
        </div>

        {/* Role toggle */}
        <div className="card p-1 flex gap-1 mb-5">
          {(['user', 'merchant'] as Role[]).map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                role === r ? 'bg-brand-green text-white shadow-glow-sm' : 'text-brand-muted hover:text-white'
              }`}>
              {r === 'user' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              {r === 'user' ? 'Personal Account' : 'Merchant / ISP'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input className="input-field pl-10" placeholder="John Doe" value={form.name}
                  onChange={e => update('name', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Phone number (M-Pesa)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input className="input-field pl-10" placeholder="07XXXXXXXX" value={form.phone}
                  onChange={e => update('phone', e.target.value)} />
              </div>
            </div>

            {role === 'merchant' && (
              <div>
                <label className="label">Business name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input className="input-field pl-10" placeholder="My Hotspot Business" value={form.businessName}
                    onChange={e => update('businessName', e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input type={show ? 'text' : 'password'} className="input-field pl-10 pr-10"
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={e => update('password', e.target.value)} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input type={show ? 'text' : 'password'} className="input-field pl-10"
                  placeholder="Repeat password" value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)} />
              </div>
            </div>

            <p className="text-xs text-brand-muted">
              By signing up you agree to our{' '}
              <Link href="/terms" className="text-brand-green hover:underline">Terms</Link> &{' '}
              <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3.5 mt-1">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                : role === 'merchant' ? 'Apply as Merchant' : 'Create Account'}
            </button>
          </form>
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
