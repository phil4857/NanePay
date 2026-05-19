'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      saveAuth(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch (err: any) {
      setError(
  err.response?.data?.error ||
  err.response?.data?.reason ||
  err.message ||
  'Registration failed. Please try again.'
)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'Amara Osei' },
    { key: 'email',    label: 'Email Address', type: 'email',    placeholder: 'you@email.com' },
    { key: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '0712345678' },
    { key: 'password', label: 'Password',      type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl font-display mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>N</div>
          <h1 className="font-display font-bold text-2xl">Create your account</h1>
          <p className="text-soft text-sm mt-1">Free forever. No hidden fees.</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#161210', border: '1px solid #2a211a' }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)' }}>
              {error}
            </div>
          )}

          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key} className="mb-4">
              <label className="block text-soft text-sm mb-2">{label}</label>
              <input type={type} placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl text-sm"
                style={{ background: '#1c1714', border: '1px solid #2a211a', color: '#f0e6dc' }} />
            </div>
          ))}

          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white mt-2 transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-soft text-sm mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#c8602a' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
