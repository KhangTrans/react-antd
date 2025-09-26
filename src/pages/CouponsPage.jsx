import React from 'react'
import { Table, Tag, Button, Space, Input, DatePicker } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function CouponsPage() {

  // Mock data
  const coupons = [
    { 
      id: 1, 
      code: 'WELCOME20', 
      type: 'percentage', 
      value: '20%', 
      minOrder: 500000,
      maxDiscount: 200000,
      usageLimit: 100,
      usedCount: 45,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active'
    },
    { 
      id: 2, 
      code: 'SAVE50K', 
      type: 'fixed', 
      value: '50,000 VNĐ', 
      minOrder: 1000000,
      maxDiscount: 50000,
      usageLimit: 50,
      usedCount: 50,
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'ended'
    },
    { 
      id: 3, 
      code: 'NEWUSER', 
      type: 'percentage', 
      value: '15%', 
      minOrder: 300000,
      maxDiscount: 100000,
      usageLimit: 200,
      usedCount: 120,
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      status: 'active'
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green'
      case 'ended': return 'red'
      case 'draft': return 'orange'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'ended': return 'Hết hạn'
      case 'draft': return 'Bản nháp'
      default: return status
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { 
      title: 'Mã giảm giá', 
      dataIndex: 'code', 
      key: 'code',
      render: (code) => (
        <Space>
          <Tag color="blue">{code}</Tag>
          <Button icon={<CopyOutlined />} size="small" type="text" />
        </Space>
      )
    },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    { 
      title: 'Đơn hàng tối thiểu', 
      dataIndex: 'minOrder', 
      key: 'minOrder',
      render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
    },
    { 
      title: 'Giảm tối đa', 
      dataIndex: 'maxDiscount', 
      key: 'maxDiscount',
      render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
    },
    { title: 'Đã sử dụng', dataIndex: 'usedCount', key: 'usedCount' },
    { title: 'Giới hạn', dataIndex: 'usageLimit', key: 'usageLimit' },
    { title: 'Ngày hết hạn', dataIndex: 'endDate', key: 'endDate' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
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
      title="Quản lý mã giảm giá" 
      description="Tạo và quản lý các mã giảm giá cho khách hàng"
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo mã giảm giá
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm mã giảm giá..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <DatePicker placeholder="Lọc theo ngày" />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={coupons} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </PageLayout>
  )
}

