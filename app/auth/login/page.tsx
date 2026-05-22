'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const [error, setError] = useState('')

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async (e?: any) => {
    if (e) e.preventDefault()

    setError('')

    if (!form.email || !form.password) {
      return setError('Please fill in all fields')
    }

    try {
      setLoading(true)

      const res = await authAPI.login({
        email: form.email.trim(),
        password: form.password,
      })

      const token =
        res.data.token ||
        res.data.accessToken

      const user =
        res.data.user ||
        res.data.data?.user

      const wallet =
        res.data.wallet ||
        res.data.data?.wallet

      if (!token || !user) {
        return setError('Invalid server response')
      }

      saveAuth(token, user, wallet)

      router.push('/dashboard')

    } catch (err: any) {
      console.log(err)

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '15px 16px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
    transition: '0.2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background:
          'radial-gradient(circle at top,#1B1B2F 0%,#09090F 55%,#050507 100%)',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          borderRadius: '26px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '22px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg,#6C63FF,#00E5A8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(108,99,255,0.4)',
            }}
          >
            N
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              marginBottom: '6px',
              background: 'linear-gradient(90deg,#6C63FF,#00E5A8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: '#9AA0B4',
              fontSize: '14px',
            }}
          >
            Login to continue to NanePay
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: '18px',
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.2)',
              color: '#FF4D6D',
              padding: '13px',
              borderRadius: '12px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit}>

          {/* EMAIL */}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.border =
                  '1px solid #6C63FF'
                e.currentTarget.style.boxShadow =
                  '0 0 0 4px rgba(108,99,255,0.12)'
              }}
              onBlur={e => {
                e.currentTarget.style.border =
                  '1px solid rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              style={{
                ...inputStyle,
                paddingRight: '54px',
              }}
              onFocus={e => {
                e.currentTarget.style.border =
                  '1px solid #6C63FF'
                e.currentTarget.style.boxShadow =
                  '0 0 0 4px rgba(108,99,255,0.12)'
              }}
              onBlur={e => {
                e.currentTarget.style.border =
                  '1px solid rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9AA0B4',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          {/* FORGOT */}
          <div
            style={{
              textAlign: 'right',
              marginBottom: '22px',
            }}
          >
            <Link
              href="/auth/forgot-password"
              style={{
                color: '#00E5A8',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '14px',
              border: 'none',
              background: loading
                ? '#2b2b38'
                : 'linear-gradient(135deg,#6C63FF,#00E5A8)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading
                ? 'none'
                : '0 12px 30px rgba(108,99,255,0.35)',
              transition: '0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* FOOTER */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '13px',
            color: '#9AA0B4',
          }}
        >
          Don’t have an account?{' '}
          <Link
            href="/auth/register"
            style={{
              color: '#00E5A8',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Create account
          </Link>
        </div>

      </div>
    </div>
  )
}
