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

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      setSuccess('Registration successful')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)

    } catch (err: any) {
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
    padding: '14px 16px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at top, #1b1b2a, #09090f)',
      color: '#fff',
    }}>

      <div style={{
        width: '100%',
        maxWidth: '430px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px)',
        borderRadius: '24px',
        padding: '30px',
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#6C63FF,#00E5A8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 800,
          }}>
            N
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            marginBottom: '6px',
            background: 'linear-gradient(90deg,#6C63FF,#00E5A8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Create Account
          </h1>

          <p style={{
            color: '#9aa0b4',
            fontSize: '14px',
          }}>
            Join NanePay and manage money smarter
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div style={{
            marginBottom: '16px',
            background: 'rgba(255,77,109,0.1)',
            border: '1px solid rgba(255,77,109,0.2)',
            color: '#FF4D6D',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginBottom: '16px',
            background: 'rgba(0,229,168,0.1)',
            border: '1px solid rgba(0,229,168,0.2)',
            color: '#00E5A8',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
          }}>
            {success}
          </div>
        )}

        {/* FORM */}
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

          <div style={{ marginBottom: '20px' }}>
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
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: loading
                ? '#2b2b38'
                : 'linear-gradient(135deg,#6C63FF,#00E5A8)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '18px',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* LOGIN */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#9aa0b4',
        }}>
          Already have an account?{' '}
          <Link
            href="/auth/login"
            style={{
              color: '#00E5A8',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  )
}
