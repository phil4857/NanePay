'use client'

import { Suspense, useState } from 'react'
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

function RegisterContent() {
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

  const normalizePhone = (phone: string) => {
    let p = phone.replace(/\s+/g, '').replace('+', '')

    if (p.startsWith('0')) {
      p = '254' + p.slice(1)
    }

    return p
  }

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
        err?.message ||
        'Registration failed'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="text-3xl font-black text-white">
              Nane<span className="text-green-400">Pay</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>
        </div>

        <div className="bg-green-900/40 border border-green-700 rounded-3xl p-8">

          <div className="space-y-4">

            <input
              className="w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 text-white"
              placeholder="Full Name"
              value={form.name}
              onChange={e => update('name', e.target.value)}
            />

            <input
              type="email"
              className="w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 text-white"
              placeholder="Email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
            />

            <input
              type="tel"
              className="w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 text-white"
              placeholder="Phone Number"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
            />

            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                className="w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 text-white pr-10"
                placeholder="Password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
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

            <input
              type={show ? 'text' : 'password'}
              className="w-full bg-green-950 border border-green-700 rounded-xl px-4 py-3 text-white"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={e =>
                update('confirmPassword', e.target.value)
              }
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-green-200 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-green-400"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
