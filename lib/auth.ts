export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('nanepay_token') : null

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('nanepay_user')
  return u ? JSON.parse(u) : null
}

export const saveAuth = (token: string, user: any) => {
  localStorage.setItem('nanepay_token', token)
  localStorage.setItem('nanepay_user', JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem('nanepay_token')
  localStorage.removeItem('nanepay_user')
}

export const isLoggedIn = () => !!getToken()
