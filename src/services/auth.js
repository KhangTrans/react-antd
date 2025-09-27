export const AUTH_KEY = 'auth_token'
export const USER_KEY = 'auth_user'

const API_BASE = import.meta.env.VITE_API_BASE || ''

function setToken(token) {
  if (token) localStorage.setItem(AUTH_KEY, token)
}

export function getToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}

function setCurrentUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function isAuthenticated() {
  return !!getToken()
}

export async function signIn({ email, password }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg || 'Đăng nhập thất bại')
  }
  const data = await res.json()
  // Backend returns { token, userId }
  setToken(data.token)
  const fullUser = await tryLoadUserById(data.userId)
  setCurrentUser(normalizeUser(fullUser) || { id: data.userId })
  return true
}

export async function signUp({ name, email, password }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })
  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg || 'Đăng ký thất bại')
  }
  const data = await res.json()
  if (data?.token) setToken(data.token)
  const fullUser = data?.userId ? await tryLoadUserById(data.userId) : null
  setCurrentUser(normalizeUser(fullUser) || (data?.userId ? { id: data.userId } : null))
  return true
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUserRoles() {
  const user = getCurrentUser()
  return Array.isArray(user?.roles) ? user.roles : []
}

// Phân quyền theo role
export function hasRole(role) {
  const roles = getUserRoles()
  return roles.includes(role)
}

export function hasAnyRole(roles) {
  const userRoles = getUserRoles()
  return roles.some(role => userRoles.includes(role))
}

export function hasAllRoles(roles) {
  const userRoles = getUserRoles()
  return roles.every(role => userRoles.includes(role))
}

// Kiểm tra quyền cụ thể
export function canManageUsers() {
  return hasRole('ROLE_ADMIN')
}

export function canManageProducts() {
  return hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER'])
}

export function canViewProducts() {
  return hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'])
}

export function canManageRoles() {
  return hasRole('ROLE_ADMIN')
}

export function canViewDashboard() {
  return hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER'])
}

export async function authFetch(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch (networkErr) {
    // normalize network/fetch errors so callers get a meaningful message
    const err = new Error('Network error')
    err.original = networkErr
    throw err
  }
  // For debugging: if response not ok, try to safely parse the body (using clone)
  // and always throw an Error with the parsed body attached as `err.body` so
  // callers don't need to read the response stream themselves.
  if (!res.ok) {
    try {
      const cloned = res.clone()
      let bodyText = null
      try { bodyText = await cloned.text() } catch { bodyText = null }
      let parsed = null
      if (bodyText) {
        try { parsed = JSON.parse(bodyText) } catch { parsed = null }
      }
      const err = new Error('Request failed')
      err.response = res
      err.status = res.status
      // parsed JSON (if any) and raw text for fallbacks
      err.body = parsed
      err.bodyText = bodyText
      throw err
    } catch {
      const err = new Error('Request failed')
      err.response = res
      err.status = res.status
      throw err
    }
  }
  return res
}

function normalizeUser(user) {
  if (!user) return null
  const roles = Array.isArray(user.roles)
    ? user.roles.map(r => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
    : []
  return {
    id: user.id,
    name: user.fullName || user.name,
    email: user.email,
    status: user.status,
    roles
  }
}

async function safeJson(res) {
  try { return await res.json() } catch { return null }
}

async function extractError(res) {
  try {
    const data = await safeJson(res)
    if (data && (data.message || data.error)) return data.message || data.error
    const text = await res.text()
    return text?.slice(0, 300)
  } catch {
    return null
  }
}

async function tryLoadUserById(userId) {
  try {
    if (!userId) return null
    const res = await authFetch('/api/v1/users')
    if (!res.ok) return null
    const list = await res.json()
    const users = Array.isArray(list) ? list : []
    return users.find(u => String(u.id) === String(userId)) || null
  } catch {
    return null
  }
}
