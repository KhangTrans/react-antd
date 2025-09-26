import React from 'react'
import { Table, Tag, Button, Space, Input, DatePicker } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function CampaignsPage() {

  // Mock data
  const campaigns = [
    { 
      id: 1, 
      name: 'Khuyến mãi Black Friday', 
      type: 'discount', 
      discount: '20%', 
      startDate: '2024-11-20',
      endDate: '2024-11-30',
      status: 'active',
      participants: 1250
    },
    { 
      id: 2, 
      name: 'Chương trình khách hàng thân thiết', 
      type: 'loyalty', 
      discount: '10%', 
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      participants: 850
    },
    { 
      id: 3, 
      name: 'Flash Sale cuối tuần', 
      type: 'flash_sale', 
      discount: '50%', 
      startDate: '2024-10-15',
      endDate: '2024-10-16',
      status: 'ended',
      participants: 2100
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
      case 'active': return 'Đang hoạt động'
      case 'ended': return 'Đã kết thúc'
      case 'draft': return 'Bản nháp'
      default: return status
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên chiến dịch', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Giảm giá', dataIndex: 'discount', key: 'discount' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Người tham gia', dataIndex: 'participants', key: 'participants' },
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
          <Button icon={<EyeOutlined />} size="small">Xem</Button>
          <Button icon={<EditOutlined />} size="small">Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageLayout 
      title="Quản lý chiến dịch" 
      description="Tạo và quản lý các chiến dịch khuyến mãi"
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo chiến dịch
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm chiến dịch..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <DatePicker placeholder="Lọc theo ngày" />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={campaigns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </PageLayout>
  )
}

