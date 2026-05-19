// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
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
import { register } from '@/lib/auth'

type Role = 'user' | 'merchant'

export default function RegisterPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultRole =
    (searchParams.get('type') === 'merchant'
      ? 'merchant'
      : 'user') as Role

  const [role, setRole] = useState<Role>(defaultRole)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    businessName: '',
  })

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  })

  const [loading, setLoading] = useState(false)

  // ─────────────────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────────────────
  const submit = async () => {

    if (!form.name.trim()) {
      toast.error('Full name is required')
      return
    }

    if (!form.email.trim()) {
      toast.error('Email address is required')
      return
    }

    if (!form.phone.trim()) {
      toast.error('Phone number is required')
      return
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (!/\d/.test(form.password)) {
      toast.error('Password must contain at least one number')
      return
    }

    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (role === 'merchant' && !form.businessName.trim()) {
      toast.error('Business name is required')
      return
    }

    setLoading(true)

    try {

      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role,
        businessName:
          role === 'merchant'
            ? form.businessName.trim()
            : undefined,
      })

      toast.success('Account created successfully')

      router.push('/auth/login')

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────
  // Password Strength
  // ─────────────────────────────────────────────────────────
  const passwordStrength =
    (form.password.length >= 8 ? 1 : 0) +
    (/\d/.test(form.password) ? 1 : 0) +
    (/[A-Z]/.test(form.password) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(form.password) ? 1 : 0)

  const strengthColor =
    passwordStrength >= 4
      ? '#52b788'
      : passwordStrength >= 3
      ? '#d4a853'
      : passwordStrength >= 2
      ? '#e67e22'
      : '#e74c3c'

  // ─────────────────────────────────────────────────────────
  // Styles (Using second script structure)
  // ─────────────────────────────────────────────────────────
  const inputStyle = {
    background: '#1c1714',
    border: '1px solid #2a211a',
    color: '#f0e6dc',
    width: '100%',
    padding: '14px 16px 14px 44px',
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

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────
  return (

    <div className="min-h-screen bg-pattern flex items-center justify-center p-6 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-5"
          >

            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #c8602a, #d4a853)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(200,96,42,0.25)',
              }}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>

            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '28px',
                color: '#f0e6dc',
              }}
            >
              Nane<span className="gradient-text">Pay</span>
            </span>
          </Link>

          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '28px',
              color: '#f0e6dc',
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              color: '#a8917f',
              fontSize: '14px',
              marginTop: '6px',
            }}
          >
            Start free. No hidden charges.
          </p>
        </div>

        {/* Role Toggle */}
        <div
          style={{
            background: '#161210',
            border: '1px solid #2a211a',
            borderRadius: '16px',
            padding: '6px',
            display: 'flex',
            gap: '6px',
            marginBottom: '18px',
          }}
        >

          {(['user', 'merchant'] as Role[]).map(r => (

            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background:
                  role === r
                    ? 'linear-gradient(135deg, #c8602a, #d4a853)'
                    : 'transparent',
                color:
                  role === r
                    ? '#fff'
                    : '#a8917f',
              }}
            >

              {r === 'user'
                ? <User className="w-4 h-4" />
                : <Building2 className="w-4 h-4" />
              }

              {r === 'user'
                ? 'Personal Account'
                : 'Merchant / ISP'
              }
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: '#161210',
            border: '1px solid #2a211a',
            borderRadius: '22px',
            padding: '32px',
          }}
        >

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>

            <label style={labelStyle}>
              Full Name
            </label>

            <div style={{ position: 'relative' }}>

              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b5a4e',
                }}
              />

              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>

            <label style={labelStyle}>
              Email Address
            </label>

            <div style={{ position: 'relative' }}>

              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b5a4e',
                }}
              />

              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>

            <label style={labelStyle}>
              Phone Number (M-Pesa)
            </label>

            <div style={{ position: 'relative' }}>

              <Phone
                size={16}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b5a4e',
                }}
              />

              <input
                type="tel"
                placeholder="0712345678"
                value={form.phone}
                onChange={e =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <p style={hintStyle}>
              Format: 0712345678 or 254712345678
            </p>
          </div>

          {/* Merchant Business */}
          {role === 'merchant' && (

            <div style={{ marginBottom: '16px' }}>

              <label style={labelStyle}>
                Business Name
              </label>

              <div style={{ position: 'relative' }}>

                <Building2
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b5a4e',
                  }}
                />

                <input
                  type="text"
                  placeholder="My Hotspot Business"
                  value={form.businessName}
                  onChange={e =>
                    setForm({
                      ...form,
                      businessName: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>

            <label style={labelStyle}>
              Password
            </label>

            <div style={{ position: 'relative' }}>

              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b5a4e',
                }}
              />

              <input
                type={show.password ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={e =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  paddingRight: '48px',
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShow({
                    ...show,
                    password: !show.password,
                  })
                }
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b5a4e',
                }}
              >
                {show.password
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>
            </div>

            <p style={hintStyle}>
              Must contain at least 8 characters and one number
            </p>

            {/* Strength */}
            {form.password.length > 0 && (

              <div style={{ marginTop: '8px' }}>

                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '5px',
                  }}
                >

                  {[1, 2, 3, 4].map(i => (

                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        background:
                          i <= passwordStrength
                            ? strengthColor
                            : '#2a211a',
                      }}
                    />
                  ))}
                </div>

                <p
                  style={{
                    ...hintStyle,
                    color: '#a8917f',
                  }}
                >
                  {passwordStrength >= 4
                    ? '💪 Strong'
                    : passwordStrength >= 3
                    ? '👍 Good'
                    : passwordStrength >= 2
                    ? '⚠️ Fair'
                    : '❌ Weak'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div style={{ marginBottom: '24px' }}>

            <label style={labelStyle}>
              Confirm Password
            </label>

            <div style={{ position: 'relative' }}>

              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b5a4e',
                }}
              />

              <input
                type={show.confirm ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e =>
                  setForm({
                    ...form,
                    confirm: e.target.value,
                  })
                }
                onKeyDown={e =>
                  e.key === 'Enter' && submit()
                }
                style={{
                  ...inputStyle,
                  paddingRight: '48px',
                  borderColor:
                    form.confirm &&
                    form.confirm !== form.password
                      ? '#e74c3c'
                      : form.confirm &&
                        form.confirm === form.password
                      ? '#52b788'
                      : '#2a211a',
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShow({
                    ...show,
                    confirm: !show.confirm,
                  })
                }
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b5a4e',
                }}
              >
                {show.confirm
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>
            </div>

            {form.confirm && (

              <p
                style={{
                  ...hintStyle,
                  color:
                    form.confirm === form.password
                      ? '#52b788'
                      : '#e74c3c',
                  marginTop: '6px',
                }}
              >
                {form.confirm === form.password
                  ? '✅ Passwords match'
                  : '❌ Passwords do not match'
                }
              </p>
            )}
          </div>

          {/* Terms */}
          <p
            style={{
              color: '#8f7a6a',
              fontSize: '12px',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            By creating an account you agree to our{' '}
            <Link
              href="/terms"
              style={{
                color: '#c8602a',
                textDecoration: 'none',
              }}
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              style={{
                color: '#c8602a',
                textDecoration: 'none',
              }}
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading
                ? '#6b5a4e'
                : 'linear-gradient(135deg, #c8602a, #d4a853)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.2s',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >

            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : role === 'merchant' ? (
              'Apply as Merchant'
            ) : (
              'Create Account →'
            )}
          </button>

          {/* Login */}
          <p
            style={{
              textAlign: 'center',
              color: '#a8917f',
              fontSize: '14px',
              marginTop: '22px',
            }}
          >
            Already have an account?{' '}

            <Link
              href="/auth/login"
              style={{
                color: '#c8602a',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
