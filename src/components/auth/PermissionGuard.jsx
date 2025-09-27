import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function PermissionGuard({ children, requiredPermission, fallback }) {
  const navigate = useNavigate()

  if (!requiredPermission) {
    return children
  }

  // Import permission functions dynamically to avoid circular dependency
  const checkPermission = () => {
    const { canViewProducts, canManageUsers, canManageRoles, canManageProducts } = require('../../services/auth')
    
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

  if (!checkPermission()) {
    if (fallback) {
      return fallback
    }

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        padding: 24
      }}>
        <Result
          icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
          title="Không có quyền truy cập"
          subTitle="Bạn không có quyền thực hiện thao tác này."
          extra={
            <Button type="primary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  return children
}
