import React from 'react'
import { Table, Tag, Button, Space, Input, Progress } from 'antd'
import { SearchOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function InventoryPage() {

  // Mock data
  const inventory = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      currentStock: 50, 
      minStock: 10, 
      maxStock: 100,
      status: 'good'
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      currentStock: 5, 
      minStock: 10, 
      maxStock: 50,
      status: 'low'
    },
    { 
      id: 3, 
      name: 'MacBook Air M2', 
      currentStock: 0, 
      minStock: 5, 
      maxStock: 20,
      status: 'out'
    },
  ]

  const getStockStatus = (current, min) => {
    if (current === 0) return { color: 'red', text: 'Hết hàng' }
    if (current <= min) return { color: 'orange', text: 'Sắp hết' }
    return { color: 'green', text: 'Đủ hàng' }
  }

  const getStockPercentage = (current, max) => {
    return Math.round((current / max) * 100)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Tồn kho hiện tại', dataIndex: 'currentStock', key: 'currentStock' },
    { title: 'Tồn kho tối thiểu', dataIndex: 'minStock', key: 'minStock' },
    { title: 'Tồn kho tối đa', dataIndex: 'maxStock', key: 'maxStock' },
    { 
      title: 'Mức tồn kho', 
      key: 'stockLevel',
      render: (_, record) => {
        const percentage = getStockPercentage(record.currentStock, record.maxStock)
        return (
          <Progress 
            percent={percentage} 
            size="small"
            status={percentage < 20 ? 'exception' : percentage < 50 ? 'active' : 'success'}
          />
        )
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (_, record) => {
        const status = getStockStatus(record.currentStock, record.minStock)
        return (
          <Tag color={status.color} icon={status.color === 'red' ? <WarningOutlined /> : null}>
            {status.text}
          </Tag>
        )
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">Cập nhật</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageLayout 
      title="Quản lý kho hàng" 
      description="Theo dõi tình trạng tồn kho và cảnh báo hết hàng"
    >
      
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={inventory} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </PageLayout>
  )
}
