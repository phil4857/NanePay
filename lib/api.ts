import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nanepay-p704.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nanepay_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('nanepay_token')
      localStorage.removeItem('nanepay_user')
      localStorage.removeItem('nanepay_wallet')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authAPI = {
  register:       (d: any) => api.post('/auth/register', d),
  login:          (d: any) => api.post('/auth/login', d),
  me:             ()       => api.get('/auth/me'),
  logout:         ()       => api.post('/auth/logout'),
  forgotPassword: (d: any) => api.post('/auth/forgot-password', d),
  resetPassword:  (d: any) => api.post('/auth/reset-password', d),
}

export const walletAPI = {
  get:      ()       => api.get('/wallet'),
  transfer: (d: any) => api.post('/wallet/transfer', d),
  withdraw: (d: any) => api.post('/wallet/withdraw', d),
}

export const txAPI = {
  list: (p?: any)    => api.get('/transactions', { params: p }),
  get:  (id: string) => api.get(`/transactions/${id}`),
}

export const mpesaAPI = {
  stkPush: (d: any)      => api.post('/mpesa/stk-push', d),
  status:  (id: string)  => api.get(`/mpesa/status/${id}`),
}

export const forexAPI = {
  rates:    ()       => api.get('/forex/rates'),
  exchange: (d: any) => api.post('/forex/exchange', d),
}

export const investAPI = {
  plans:    ()            => api.get('/invest/plans'),
  mine:     ()            => api.get('/invest/mine'),
  invest:   (d: any)     => api.post('/invest', d),
  withdraw: (id: string) => api.post(`/invest/${id}/withdraw`),
}

export const merchantAPI = {
  profile:    ()       => api.get('/merchant/profile'),
  register:   (d: any) => api.post('/merchant/register', d),
  links:      ()       => api.get('/merchant/payment-links'),
  createLink: (d: any) => api.post('/merchant/payment-links', d),
  analytics:  ()       => api.get('/merchant/analytics'),
}

export const packageAPI = {
  list:   (p?: any) => api.get('/packages', { params: p }),
  get:    (id: string) => api.get(`/packages/${id}`),
  create: (d: any)  => api.post('/packages', d),
  update: (id: string, d: any) => api.patch(`/packages/${id}`, d),
}

export const subAPI = {
  subscribe: (d: any)    => api.post('/subscriptions', d),
  mine:      ()          => api.get('/subscriptions/mine'),
  get:       (id: string) => api.get(`/subscriptions/${id}`),
}

export const notifAPI = {
  list:    ()            => api.get('/notifications'),
  readAll: ()            => api.patch('/notifications/read-all'),
  read:    (id: string)  => api.patch(`/notifications/${id}/read`),
}

export const qrAPI = {
  generate: (d: any)    => api.post('/qr/generate', d),
  get:      (id: string) => api.get(`/qr/${id}`),
}

export const requestAPI = {
  send: (d: any) => api.post('/request', d),
}

export const adminAPI = {
  stats:           ()                    => api.get('/admin/stats'),
  users:           (p?: any)             => api.get('/admin/users', { params: p }),
  suspendUser:     (id: string)          => api.patch(`/admin/users/${id}/suspend`),
  merchants:       (p?: any)             => api.get('/admin/merchants', { params: p }),
  approveMerchant: (id: string, d: any)  => api.patch(`/admin/merchants/${id}/approve`, d),
  transactions:    (p?: any)             => api.get('/admin/transactions', { params: p }),
  reverseTransaction: (id: string)       => api.patch(`/admin/transactions/${id}/reverse`),
  withdrawals:     (p?: any)             => api.get('/admin/withdrawals', { params: p }),
  subscriptions:   (p?: any)             => api.get('/admin/subscriptions', { params: p }),
  revenue:         ()                    => api.get('/admin/reports/revenue'),
}

export const billsAPI = {
  types:     ()       => api.get('/bills/types'),
  providers: (t: string) => api.get(`/bills/providers/${t}`),
  wifi:      (d: any) => api.post('/bills/wifi', d),
  pay:       (d: any) => api.post('/bills/pay', d),
  history:   ()       => api.get('/bills/history'),
}
