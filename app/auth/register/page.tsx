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

  const submit = async () => {
    setError('')

    if (!form.name.trim())        return setError('Full name is required')
    if (!form.email.trim())       return setError('Email is required')
    if (!form.phone.trim())       return setError('Phone number is required')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (!/\d/.test(form.password)) return setError('Password must contain at least one number')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      const res = await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.trim(),
        password: form.password,
      })
      saveAuth(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map((e: any) => e.message).join(', '))
      } else {
        setError(data?.error || data?.reason || err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {visible ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )

  const inputStyle = {
    background: '#1c1714',
    border: '1px solid #2a211a',
    color: '#f0e6dc',
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    color: '#a8917f',
    fontSize: '13px',
    marginBottom: '8px',
  }

  const hintStyle = {
    color: '#6b5a4e',
    fontSize: '11px',
    marginTop: '5px',
  }

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-6">
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #c8602a, #d4a853)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff',
            fontSize: '22px', margin: '0 auto 12px',
          }}>N</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: '#f0e6dc' }}>
            Create your account
          </h1>
          <p style={{ color: '#a8917f', fontSize: '14px', marginTop: '6px' }}>
            Free forever. No hidden fees.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#161210', border: '1px solid #2a211a', borderRadius: '20px', padding: '32px' }}>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '20px',
              color: '#e74c3c', fontSize: '13px', lineHeight: '1.5',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              placeholder="0712345678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
            <p style={hintStyle}>Format: 0712345678 or 254712345678</p>
          </div>

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
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6b5a4e', display: 'flex', alignItems: 'center',
                }}>
                <EyeIcon visible={show.password} />
              </button>
            </div>
            <p style={hintStyle}>At least 8 characters with one number e.g. Password1</p>

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => {
                    const strength =
                      (form.password.length >= 8 ? 1 : 0) +
                      (/\d/.test(form.password) ? 1 : 0) +
                      (/[A-Z]/.test(form.password) ? 1 : 0) +
                      (/[^a-zA-Z0-9]/.test(form.password) ? 1 : 0)
                    const color = strength >= 4 ? '#52b788' : strength >= 3 ? '#d4a853' : strength >= 2 ? '#e67e22' : '#e74c3c'
                    return (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= strength ? color : '#2a211a',
                        transition: 'background 0.2s',
                      }} />
                    )
                  })}
                </div>
                <p style={{ ...hintStyle, color: '#a8917f' }}>
                  {(() => {
                    const s = (form.password.length >= 8 ? 1 : 0) + (/\d/.test(form.password) ? 1 : 0) + (/[A-Z]/.test(form.password) ? 1 : 0) + (/[^a-zA-Z0-9]/.test(form.password) ? 1 : 0)
                    return s >= 4 ? '💪 Strong' : s >= 3 ? '👍 Good' : s >= 2 ? '⚠️ Fair' : '❌ Weak'
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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
                  borderColor: form.confirm && form.confirm !== form.password ? '#e74c3c' : form.confirm && form.confirm === form.password ? '#52b788' : '#2a211a',
                }}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6b5a4e', display: 'flex', alignItems: 'center',
                }}>
                <EyeIcon visible={show.confirm} />
              </button>
            </div>
            {form.confirm && (
              <p style={{ ...hintStyle, color: form.confirm === form.password ? '#52b788' : '#e74c3c', marginTop: '6px' }}>
                {form.confirm === form.password ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#6b5a4e' : 'linear-gradient(135deg, #c8602a, #d4a853)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>

          <p style={{ textAlign: 'center', color: '#a8917f', fontSize: '14px', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#c8602a', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
