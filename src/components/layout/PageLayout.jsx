import React from 'react'
import AdminLayout from './AdminLayout'
import { getCurrentUser, signOut } from '../../services/auth'
import { useNavigate } from 'react-router-dom'

export default function PageLayout({ children, title, description }) {
  const nav = useNavigate()
  const user = getCurrentUser()
  const handleLogout = () => { signOut(); nav('/login', { replace: true }) }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div style={{ marginBottom: 16 }}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </AdminLayout>
  )
}

