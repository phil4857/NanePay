import axios from 'axios'

const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://nanepay-p704.onrender.com/api'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// ── Request Interceptor ──────────────────────────────

api.interceptors.request.use((cfg) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('np_token')

    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`
    }
  }

  return cfg
})

// ── Response Interceptor ─────────────────────────────

api.interceptors.response.use(
  (response) => response,

  (err) => {
    if (
      err.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      localStorage.removeItem('np_token')
      localStorage.removeItem('np_user')

      window.location.href = '/auth/login'
    }

    return Promise.reject(err)
  }
)

export default api

// ── Auth ─────────────────────────────────────────────

export const authAPI = {
  register: (d: any) =>
    api.post('/auth/register', d),

  login: (d: any) =>
    api.post('/auth/login', d),

  me: () =>
    api.get('/auth/me'),

  forgotPassword: (d: any) =>
    api.post('/auth/forgot-password', d),

  resetPassword: (d: any) =>
    api.post('/auth/reset-password', d),

  setPin: (d: any) =>
    api.post('/auth/set-pin', d),
}

// ── Wallet ───────────────────────────────────────────

export const walletAPI = {
  balance: () =>
    api.get('/wallet/balance'),

  deposit: (d: any) =>
    api.post('/wallet/deposit', d),

  transfer: (d: any) =>
    api.post('/wallet/transfer', d),

  withdraw: (d: any) =>
    api.post('/wallet/withdraw', d),
}

// ── Transactions ─────────────────────────────────────

export const txAPI = {
  list: (p?: any) =>
    api.get('/transactions', {
      params: p,
    }),

  get: (ref: string) =>
    api.get(`/transactions/${ref}`),
}

// ── M-Pesa ───────────────────────────────────────────

export const mpesaAPI = {
  stkPush: (d: any) =>
    api.post('/mpesa/stk-push', d),

  status: (id: string) =>
    api.get(`/mpesa/stk-status/${id}`),
}

// ── Investments ──────────────────────────────────────

export const investAPI = {
  plans: () =>
    api.get('/invest/plans'),

  mine: () =>
    api.get('/invest'),

  invest: (d: any) =>
    api.post('/invest', d),

  withdraw: (id: string) =>
    api.post(`/invest/${id}/withdraw`),
}

// ── Forex ────────────────────────────────────────────

export const forexAPI = {
  rates: () =>
    api.get('/forex/rates'),

  exchange: (d: any) =>
    api.post('/forex/exchange', d),
}

// ── WiFi ─────────────────────────────────────────────

export const wifiAPI = {
  vendors: () =>
    api.get('/wifi/vendors'),

  sessions: () =>
    api.get('/wifi/sessions'),

  buy: (d: any) =>
    api.post('/wifi/buy', d),

  validate: (v: string) =>
    api.get(`/wifi/validate/${v}`),
}

// ── Hotspot ──────────────────────────────────────────

export const hotspotAPI = {
  browse: () =>
    api.get('/hotspot/browse'),

  mine: () =>
    api.get('/hotspot/mine'),

  register: (d: any) =>
    api.post('/hotspot/register', d),

  addPackage: (
    vendorId: string,
    d: any
  ) =>
    api.post(
      `/hotspot/${vendorId}/packages`,
      d
    ),

  delPackage: (
    vendorId: string,
    pkgId: string
  ) =>
    api.delete(
      `/hotspot/${vendorId}/packages/${pkgId}`
    ),

  stats: (vendorId: string) =>
    api.get(`/hotspot/${vendorId}/stats`),
}

// ── Merchant ─────────────────────────────────────────

export const merchantAPI = {
  register: (d: any) =>
    api.post('/merchant/register', d),

  dashboard: () =>
    api.get('/merchant/dashboard'),

  analytics: () =>
    api.get('/merchant/analytics'),

  link: () =>
    api.get('/merchant/link'),

  pay: (
    slug: string,
    d: any
  ) =>
    api.post(
      `/merchant/pay/${slug}`,
      d
    ),
}

// ── Packages ─────────────────────────────────────────

export const packageAPI = {
  list: () =>
    api.get('/packages'),

  get: (id: string) =>
    api.get(`/packages/${id}`),

  create: (d: any) =>
    api.post('/packages', d),

  update: (
    id: string,
    d: any
  ) =>
    api.put(`/packages/${id}`, d),

  remove: (id: string) =>
    api.delete(`/packages/${id}`),

  vendorPackages: (
    vendorId: string
  ) =>
    api.get(
      `/hotspot/${vendorId}/packages`
    ),

  addVendorPackage: (
    vendorId: string,
    d: any
  ) =>
    api.post(
      `/hotspot/${vendorId}/packages`,
      d
    ),

  deleteVendorPackage: (
    vendorId: string,
    packageId: string
  ) =>
    api.delete(
      `/hotspot/${vendorId}/packages/${packageId}`
    ),
}

// ── Coupons ──────────────────────────────────────────

export const couponAPI = {
  list: () =>
    api.get('/coupon'),

  redeem: (id: string) =>
    api.post(`/coupon/${id}/redeem`),
}

// ── Referrals ────────────────────────────────────────

export const referralAPI = {
  stats: () =>
    api.get('/referrals/stats'),

  claim: (d: any) =>
    api.post('/referrals/claim', d),
}

// ── KYC ──────────────────────────────────────────────

export const kycAPI = {
  submit: (d: any) =>
    api.post('/kyc/submit', d),

  status: () =>
    api.get('/kyc/status'),
}

// ── Notifications ────────────────────────────────────

export const notifAPI = {
  list: () =>
    api.get('/notifications'),

  read: (id: string) =>
    api.patch(
      `/notifications/${id}/read`
    ),

  readAll: () =>
    api.patch('/notifications/read-all'),
}

// ── Bills ────────────────────────────────────────────

export const billsAPI = {
  wifi: (d: any) =>
    api.post('/bills/wifi', d),

  pay: (d: any) =>
    api.post('/bills/pay', d),
}

// ── QR ───────────────────────────────────────────────

export const qrAPI = {
  generate: (d: any) =>
    api.post('/qr/generate', d),

  get: (id: string) =>
    api.get(`/qr/${id}`),
}

// ── Request Money ────────────────────────────────────

export const requestAPI = {
  send: (d: any) =>
    api.post('/request', d),
}

// ── Admin ────────────────────────────────────────────

export const adminAPI = {
  stats: () =>
    api.get('/admin/stats'),

  users: (p?: any) =>
    api.get('/admin/users', {
      params: p,
    }),

  updateUserStatus: (
    id: string,
    d: any
  ) =>
    api.patch(
      `/admin/users/${id}/status`,
      d
    ),

  transactions: (p?: any) =>
    api.get('/admin/transactions', {
      params: p,
    }),

  vendors: () =>
    api.get('/admin/vendors'),

  updateVendorStatus: (
    id: string,
    d: any
  ) =>
    api.patch(
      `/admin/vendors/${id}/status`,
      d
    ),

  revenue: () =>
    api.get('/admin/stats'),

  merchants: (p?: any) =>
    api.get('/admin/merchants', {
      params: p,
    }),

  approveMerchant: (
    id: string,
    d: any
  ) =>
    api.patch(
      `/admin/merchants/${id}/approve`,
      d
    ),
}
