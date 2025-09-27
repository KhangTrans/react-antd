import React, { useMemo } from 'react'
import { Table, Tag } from 'antd'

export default function OrdersTable() {
  const data = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      key: i + 1,
      code: `ORD-${1000 + i}`,
      customer: ['Minh','Lan','Hùng','Trang','Phúc','My','An','Linh'][i],
      total: 1200000 + i * 150000,
      status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'paid' : 'shipped',
    })), [] )

  const columns = [
    { title: 'Mã đơn', dataIndex: 'code' },
    { title: 'Khách hàng', dataIndex: 'customer' },
    { title: 'Tổng tiền', dataIndex: 'total', render: (v) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => <Tag color={s==='paid'?'green':s==='shipped'?'blue':'gold'}>{s.toUpperCase()}</Tag> },
  ]

  return <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
}