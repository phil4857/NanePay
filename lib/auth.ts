export interface AuthUser {
  id: string | number
  name: string
  email: string
  phone: string
  role: 'user' | 'admin' | 'vendor'
  kyc_status?: 'none' | 'pending' | 'verified'
  referral_code?: string
  balance?: number
  created_at?: string
}

// ── Token ──────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('np_token')
}

// ── User ───────────────────────────────────────────────────────
export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  try {
    const u = localStorage.getItem('np_user')
    return u ? JSON.parse(u) : null
  } catch {
    return null
  }
}

// ── Save ───────────────────────────────────────────────────────
export const saveAuth = (token: string, user: AuthUser) => {
  if (typeof window === 'undefined') return

  localStorage.setItem('np_token', token)
  localStorage.setItem('np_user', JSON.stringify(user))
}

// ── Clear ──────────────────────────────────────────────────────
export const clearAuth = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem('np_token')
  localStorage.removeItem('np_user')
}

// ── Checks ─────────────────────────────────────────────────────
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

export const isAdmin = (): boolean => {
  return getUser()?.role === 'admin'
}

export const isVendor = (): boolean => {
  const role = getUser()?.role
  return role === 'vendor' || role === 'admin'
}

// ── Formatters ─────────────────────────────────────────────────
export const fmtKES = (n: number | string): string => {
  return `KES ${(Number(n) || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const fmtDate = (d: string): string => {
  return new Date(d).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const fmtDateTime = (d: string): string => {
  return new Date(d).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Fees ───────────────────────────────────────────────────────
export const calcFee = (amount: number): number => {
  return Math.round(Number(amount) * 0.01 * 100) / 100
}

export const totalWithFee = (amount: number): number => {
  return Number(amount) + calcFee(amount)
}
