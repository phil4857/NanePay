export interface AuthUser {
  id:         string
  name:       string
  email:      string
  phone:      string
  role:       'user' | 'merchant' | 'admin'
  is_active:  boolean
  created_at: string
}

export interface AuthWallet {
  balance:            number
  currency:           string
  investment_balance?: number
}

// ── TOKEN ─────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('nanepay_token')
}

// ── USER ──────────────────────────────────────────────────────
export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const u = localStorage.getItem('nanepay_user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

// ── WALLET ────────────────────────────────────────────────────
export const getWallet = (): AuthWallet | null => {
  if (typeof window === 'undefined') return null
  try {
    const w = localStorage.getItem('nanepay_wallet')
    return w ? JSON.parse(w) : null
  } catch { return null }
}

// ── SAVE ──────────────────────────────────────────────────────
export const saveAuth = (token: string, user: AuthUser, wallet?: AuthWallet) => {
  localStorage.setItem('nanepay_token', token)
  localStorage.setItem('nanepay_user',  JSON.stringify(user))
  if (wallet) localStorage.setItem('nanepay_wallet', JSON.stringify(wallet))
}

export const updateWallet = (wallet: AuthWallet) => {
  localStorage.setItem('nanepay_wallet', JSON.stringify(wallet))
}

// ── CLEAR ─────────────────────────────────────────────────────
export const clearAuth = () => {
  localStorage.removeItem('nanepay_token')
  localStorage.removeItem('nanepay_user')
  localStorage.removeItem('nanepay_wallet')
}

// ── CHECKS ────────────────────────────────────────────────────
export const isLoggedIn  = (): boolean  => !!getToken()
export const isAdmin     = (): boolean  => getUser()?.role === 'admin'
export const isMerchant  = (): boolean  => ['merchant', 'admin'].includes(getUser()?.role || '')

// ── FORMAT HELPERS ────────────────────────────────────────────
export const fmtKES = (n: number): string =>
  `KES ${(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

export const fmtDateTime = (d: string): string =>
  new Date(d).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
