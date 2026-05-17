import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://nanepay-p704.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nanepay_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('nanepay_token')
      localStorage.removeItem('nanepay_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authAPI = {
  register: (d: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', d),
  login: (d: { email: string; password: string }) =>
    api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const walletAPI = {
  get: ()                => api.get('/wallet'),
  transfer: (d: any)    => api.post('/wallet/transfer', d),
  withdraw: (d: any)    => api.post('/wallet/withdraw', d),
}

export const txAPI = {
  list: (p?: any) => api.get('/transactions', { params: p }),
  get:  (id: string) => api.get(`/transactions/${id}`),
}

export const mpesaAPI = {
  stkPush: (d: { amount: number }) => api.post('/mpesa/stk-push', d),
  status:  (id: string)            => api.get(`/mpesa/status/${id}`),
}

export const forexAPI = {
  rates:    ()      => api.get('/forex/rates'),
  exchange: (d: any) => api.post('/forex/exchange', d),
}

export const investAPI = {
  plans:    ()             => api.get('/invest/plans'),
  mine:     ()             => api.get('/invest/mine'),
  invest:   (d: any)      => api.post('/invest', d),
  withdraw: (id: string)  => api.post(`/invest/${id}/withdraw`),
}

export const merchantAPI = {
  profile:      ()      => api.get('/merchant/profile'),
  register:     (d: any) => api.post('/merchant/register', d),
  links:        ()      => api.get('/merchant/payment-links'),
  createLink:   (d: any) => api.post('/merchant/payment-links', d),
  analytics:    ()      => api.get('/merchant/analytics'),
}
