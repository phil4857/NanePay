'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const register = async (e: any) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return setError('Fill in all fields')
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setLoading(true)

      const res = await api.post('/auth/register', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      })

      console.log(res.data)

      localStorage.setItem('nanepay_token', res.data.token)
      localStorage.setItem('nanepay_user', JSON.stringify(res.data.user))

      setSuccess('Registration successful')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)

    } catch (err: any) {
      console.log(err?.response?.data)

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '15px 16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at top left, rgba(108,99,255,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(0,229,168,0.18), transparent 30%), #07070B',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(18,18,26,0.92)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          borderRadius: '28px',
          padding: '34px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '82px',
              height: '82px',
              borderRadius: '24px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg,#6C63FF,#00E5A8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 900,
              color: '#fff',
              boxShadow: '0 10px 35px rgba(108,99,255,0.35)',
            }}
          >
            N
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 900,
              marginBottom: '8px',
              background: 'linear-gradient(90deg,#6C63FF,#00E5A8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              color: '#9AA0B4',
              fontSize: '14px',
              lineHeight: 1.5,
            }}
          >
            Secure digital payments, investments, forex and bill management in one platform.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: '16px',
              background: 'rgba(255,77,109,0.12)',
              border: '1px solid rgba(255,77,109,0.25)',
              color: '#FF4D6D',
              padding: '13px',
              borderRadius: '14px',
              fontSize: '13px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            style={{
              marginBottom: '16px',
              background: 'rgba(0,229,168,0.12)',
              border: '1px solid rgba(0,229,168,0.25)',
              color: '#00E5A8',
              padding: '13px',
              borderRadius: '14px',
              fontSize: '13px',
            }}
          >
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={register}>
          <div style={{ marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '16px',
              border: 'none',
              background: loading
                ? '#2b2b38'
                : 'linear-gradient(135deg,#6C63FF,#00E5A8)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              boxShadow: loading
                ? 'none'
                : '0 10px 30px rgba(108,99,255,0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#9AA0B4',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/auth/login"
            style={{
              color: '#00E5A8',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
