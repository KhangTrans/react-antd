export const AUTH_KEY = 'demo_token'
export const USER_KEY = 'demo_user'

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}

export function isAuthenticated() {
  return !!localStorage.getItem(AUTH_KEY)
}

export function signIn({ email, password }) {
  if (email && password) {
    localStorage.setItem(AUTH_KEY, 'dummy.jwt.token')
    localStorage.setItem(USER_KEY, JSON.stringify({ email, name: email.split('@')[0] || 'User' }))
    return true
  }
  return false
}

export function signUp({ name, email, password }) {
  if (name && email && (password?.length >= 6)) {
    localStorage.setItem(AUTH_KEY, 'dummy.jwt.token')
    localStorage.setItem(USER_KEY, JSON.stringify({ email, name }))
    return true
  }
  return false
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_KEY)
}
