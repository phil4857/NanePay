'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      saveAuth(res.data.token, res.data.user, res.data.wallet)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  const s = {
    input: {
      width: '100%', padding: '14px 16px', borderRadius: '12px',
      background: '#1A1A26', border: '1px solid #2A2A3E',
      color: '#F0F0FF', fontSize: '15px', fontFamily: 'Space Grotesk, sans-serif',
      outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box' as const,
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,212,170,0.07) 0%, transparent 50%)' }}>

      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 30px rgba(108,99,255,0.4)',
          }}>N</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', color: '#F0F0FF', marginBottom: '6px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>Sign in to your NanePay account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '20px', padding: '32px' }}>

          {error && (
            <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF4560', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.3px' }}>
              Email Address
            </label>
            <input
              type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={s.input}
              onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
              onBlur={e => { e.target.style.borderColor = '#2A2A3E'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ ...s.input, paddingRight: '48px' }}
                onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                onBlur={e => { e.target.style.borderColor = '#2A2A3E'; e.target.style.boxShadow = 'none' }}
              />
              <button type="button" onClick={() => setShow(!show)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#44445A',
                fontSize: '16px', display: 'flex', alignItems: 'center',
              }}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="/auth/forgot-password" style={{ color: '#6C63FF', fontSize: '13px', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <button onClick={submit} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: loading ? '#2A2A3E' : 'linear-gradient(135deg, #6C63FF, #9C92FF)',
            border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.35)',
          }}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', color: '#8888AA', fontSize: '14px', marginTop: '20px' }}>
            No account?{' '}
            <Link href="/auth/register" style={{ color: '#00D4AA', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
