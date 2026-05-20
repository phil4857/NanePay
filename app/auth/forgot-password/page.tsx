'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [devToken, setDevToken] = useState('')

  const submit = async () => {
    if (!email) return setError('Email is required')
    setError(''); setLoading(true)
    try {
      const res = await authAPI.forgotPassword({ email })
      setSent(true)
      if (res.data.dev_token) setDevToken(res.data.dev_token)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.1) 0%, transparent 50%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 30px rgba(108,99,255,0.4)',
          }}>N</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', color: '#F0F0FF', marginBottom: '4px' }}>
            Reset Password
          </h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>
            {sent ? 'Check your email for the reset link' : "Enter your email and we'll send a reset link"}
          </p>
        </div>

        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '20px', padding: '32px' }}>
          {!sent ? (
            <>
              {error && (
                <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF4560', fontSize: '13px' }}>
                  ⚠️ {error}
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>Email Address</label>
                <input type="email" placeholder="you@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <button onClick={submit} disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
                border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
              }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
                Reset link sent!
              </h3>
              <p style={{ color: '#8888AA', fontSize: '14px', marginBottom: '20px' }}>
                Check your email inbox for the reset link. It expires in 1 hour.
              </p>
              {devToken && (
                <div style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'left' }}>
                  <p style={{ color: '#6C63FF', fontSize: '11px', marginBottom: '6px' }}>DEV MODE — Reset token:</p>
                  <Link href={`/auth/reset-password?token=${devToken}`} style={{ color: '#00D4AA', fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' as const }}>
                    Click here to reset password
                  </Link>
                </div>
              )}
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#8888AA', fontSize: '14px', marginTop: '20px' }}>
            Remember it?{' '}
            <Link href="/auth/login" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
