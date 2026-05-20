'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'

function ResetForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const token        = params.get('token') || ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [show, setShow] = useState({ password: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const submit = async () => {
    if (!form.password || !form.confirm) return setError('Please fill in all fields')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (!/\d/.test(form.password)) return setError('Password must contain at least one number')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setError(''); setLoading(true)
    try {
      await authAPI.resetPassword({ token, password: form.password })
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Reset failed. Try again.')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '14px 16px', paddingRight: '48px', borderRadius: '12px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '20px', padding: '32px' }}>
      {done ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Password Reset!</h3>
          <p style={{ color: '#8888AA' }}>Redirecting to login...</p>
        </div>
      ) : (
        <>
          {error && <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF4560', fontSize: '13px' }}>⚠️ {error}</div>}
          {[
            { key: 'password', label: 'New Password', placeholder: 'Min 8 characters, include a number' },
            { key: 'confirm',  label: 'Confirm Password', placeholder: 'Re-enter your password' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <input type={(show as any)[key] ? 'text' : 'password'} placeholder={placeholder}
                  value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ ...inputStyle, borderColor: key === 'confirm' && form.confirm ? (form.confirm === form.password ? '#00D4AA' : '#FF4560') : '#2A2A3E' }} />
                <button type="button" onClick={() => setShow({ ...show, [key]: !(show as any)[key] })}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#44445A', fontSize: '16px' }}>
                  {(show as any)[key] ? '🙈' : '👁️'}
                </button>
              </div>
              {key === 'confirm' && form.confirm && (
                <p style={{ color: form.confirm === form.password ? '#00D4AA' : '#FF4560', fontSize: '11px', marginTop: '5px' }}>
                  {form.confirm === form.password ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>
          ))}
          <button onClick={submit} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px',
            background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
            border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
      <p style={{ textAlign: 'center', color: '#8888AA', fontSize: '14px', marginTop: '20px' }}>
        <Link href="/auth/login" style={{ color: '#6C63FF', textDecoration: 'none' }}>← Back to login</Link>
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.1) 0%, transparent 50%)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 14px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color: '#fff', boxShadow: '0 0 30px rgba(108,99,255,0.4)' }}>N</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', color: '#F0F0FF', marginBottom: '4px' }}>New Password</h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>Create a strong new password</p>
        </div>
        <Suspense fallback={<div style={{ color: '#8888AA', textAlign: 'center' }}>Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
