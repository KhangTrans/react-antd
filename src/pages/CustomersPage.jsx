import React from 'react'
import { Table, Tag, Button, Space, Input } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function CustomersPage() {

  // Mock data
  const customers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0123456789', status: 'active', orders: 5 },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0987654321', status: 'inactive', orders: 2 },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0369258147', status: 'active', orders: 8 },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      )
    },
    { title: 'Số đơn hàng', dataIndex: 'orders', key: 'orders' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageLayout 
      title="Quản lý khách hàng" 
      description="Xem và quản lý thông tin khách hàng"
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm khách hàng..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={customers} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </PageLayout>
  )
}
