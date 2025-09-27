import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, getUserRoles } from '../services/auth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const authed = isAuthenticated()
  const location = useLocation()
  if (!authed) return <Navigate to="/login" replace state={{ from: location }} />

  // If no specific allowedRoles are passed, default to allowing only ROLE_ADMIN and ROLE_MANAGER
  const defaultAllowed = ['ROLE_ADMIN', 'ROLE_MANAGER']
  const allowed = Array.isArray(allowedRoles) && allowedRoles.length > 0 ? allowedRoles : defaultAllowed

  const roles = getUserRoles()
  const hasAccess = roles.some(r => allowed.includes(r))
  if (!hasAccess) return <Navigate to="/dashboard" replace />

  return children
}