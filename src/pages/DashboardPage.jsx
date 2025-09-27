import React from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import OverviewCards from '../components/dashboard/OverviewCards'
import OrdersTable from '../components/dashboard/OrdersTable'
import { getCurrentUser, signOut } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage({ user: propUser, onLogout }) {
  const nav = useNavigate()
  const user = propUser || getCurrentUser()
  const handleLogout = () => { signOut(); nav('/login', { replace: true }) }
  return (
    <AdminLayout user={user} onLogout={onLogout || handleLogout}>
      <OverviewCards />
      <div style={{ marginTop: 16 }}>
        <OrdersTable />
      </div>
    </AdminLayout>
  )
}