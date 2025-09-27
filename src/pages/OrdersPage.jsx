import React from 'react'
import PageLayout from '../components/layout/PageLayout'
import OrdersTable from '../components/dashboard/OrdersTable'

export default function OrdersPage() {
  return (
    <PageLayout 
      title="Quản lý đơn hàng" 
      description="Xem và quản lý tất cả đơn hàng trong hệ thống"
    >
      <OrdersTable />
    </PageLayout>
  )
}
