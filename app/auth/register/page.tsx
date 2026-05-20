'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: ''
  })
  const [show, setShow]       = useState({ password: false, confirm: false })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState(1)

  const strength = (() => {
    const p = form.password
    let s = 0
    if (p.length >= 8)          s++
    if (/\d/.test(p))           s++
    if (/[A-Z]/.test(p))        s++
    if (/[^a-zA-Z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', '❌ Weak', '⚠️ Fair', '👍 Good', '💪 Strong'][strength]
  const strengthColor = ['', '#FF4560', '#FFD700', '#00D4AA', '#00D4AA'][strength]

  const validateStep1 = () => {
    if (!form.name.trim())  return setError('Full name is required')
    if (!form.email.trim()) return setError('Email is required')
    if (!form.phone.trim()) return setError('Phone number is required')
    setError('')
    setStep(2)
  }

  const submit = async () => {
    setError('')
    if (form.password.length < 8)    return setError('Password must be at least 8 characters')
    if (!/\d/.test(form.password))   return setError('Password must contain at least one number')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      const res = await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.trim(),
        password: form.password,
      })
      saveAuth(res.data.token, res.data.user, res.data.wallet)
      router.push('/dashboard')
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) {
        setError(data.errors.map((e: any) => e.message).join(', '))
      } else {
        setError(data?.error || data?.reason || 'Registration failed. Please try again.')
      }
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    background: '#1A1A26',
    border: '1px solid #2A2A3E',
    color: '#F0F0FF',
    fontSize: '15px',
    fontFamily: 'Space Grotesk, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#8888AA',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '8px',
  }

  const hintStyle: React.CSSProperties = {
    color: '#44445A',
    fontSize: '11px',
    marginTop: '5px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,212,170,0.07) 0%, transparent 50%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px',
            margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontFamily: 'Outfit, sans-serif',
            fontWeight: 800, color: '#fff',
            boxShadow: '0 0 30px rgba(108,99,255,0.4)',
          }}>N</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', color: '#F0F0FF', marginBottom: '4px' }}>
            Create your account
          </h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>Free forever · No hidden fees</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i <= step
                ? 'linear-gradient(90deg, #6C63FF, #00D4AA)'
                : '#2A2A3E',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '20px', padding: '32px' }}>

          {error && (
            <div style={{
              background: 'rgba(255,69,96,0.1)',
              border: '1px solid rgba(255,69,96,0.25)',
              borderRadius: '10px', padding: '12px 14px',
              marginBottom: '20px', color: '#FF4560', fontSize: '13px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '17px', marginBottom: '20px', color: '#8888AA' }}>
                Step 1 — Personal Info
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Amara Osei"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="0712345678"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && validateStep1()}
                  style={inputStyle}
                />
                <p style={hintStyle}>Format: 0712345678 or 254712345678</p>
              </div>

              <button
                onClick={validateStep1}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
                  border: 'none', color: '#fff', fontSize: '15px',
                  fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
                }}>
                Continue →
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '17px', marginBottom: '20px', color: '#8888AA' }}>
                Step 2 — Create Password
              </h3>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={show.password ? 'text' : 'password'}
                    placeholder="Min 8 characters, include a number"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, password: !show.password })}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#44445A', fontSize: '16px',
                    }}>
                    {show.password ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          background: i <= strength ? strengthColor : '#2A2A3E',
                          transition: 'background 0.2s',
                        }} />
                      ))}
                    </div>
                    <p style={{ ...hintStyle, color: strengthColor }}>{strengthLabel}</p>
                  </div>
                )}
                <p style={hintStyle}>At least 8 characters with one number</p>
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    style={{
                      ...inputStyle,
                      paddingRight: '48px',
                      borderColor: form.confirm
                        ? form.confirm === form.password ? '#00D4AA' : '#FF4560'
                        : '#2A2A3E',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, confirm: !show.confirm })}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#44445A', fontSize: '16px',
                    }}>
                    {show.confirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.confirm && (
                  <p style={{
                    ...hintStyle, marginTop: '6px',
                    color: form.confirm === form.password ? '#00D4AA' : '#FF4560',
                  }}>
                    {form.confirm === form.password ? '✅ Passwords match' : '❌ Passwords do not match'}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    background: 'none', border: '1px solid #2A2A3E',
                    color: '#8888AA', fontSize: '14px', cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={loading}
                  style={{
                    flex: 2, padding: '14px', borderRadius: '12px',
                    background: loading ? '#2A2A3E' : 'linear-gradient(135deg, #6C63FF, #9C92FF)',
                    border: 'none', color: '#fff', fontSize: '15px',
                    fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.35)',
                  }}>
                  {loading ? '⏳ Creating...' : 'Create Account 🎉'}
                </button>
              </div>
            </>
          )}

          <p style={{ textAlign: 'center', color: '#8888AA', fontSize: '14px', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
