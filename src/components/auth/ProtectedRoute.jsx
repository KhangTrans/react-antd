import React from 'react'
import { Navigate } from 'react-router-dom'
import { canViewProducts, canManageUsers, canManageRoles, canManageProducts } from '../../services/auth'

export default function ProtectedRoute({ children, requiredPermission }) {
  // Kiểm tra quyền truy cập dựa trên requiredPermission
  const hasPermission = () => {
    switch (requiredPermission) {
      case 'viewProducts':
        return canViewProducts()
      case 'manageUsers':
        return canManageUsers()
      case 'manageRoles':
        return canManageRoles()
      case 'manageProducts':
        return canManageProducts()
      default:
        return true
    }
  }

  if (!hasPermission()) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
