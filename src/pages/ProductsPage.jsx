import React from 'react'
import { Table, Tag, Button, Space, Input, Image } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function ProductsPage() {

  // Mock data
  const products = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      category: 'Điện thoại', 
      price: 29990000, 
      stock: 50, 
      status: 'active',
      image: 'https://via.placeholder.com/50x50'
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      category: 'Điện thoại', 
      price: 24990000, 
      stock: 30, 
      status: 'active',
      image: 'https://via.placeholder.com/50x50'
    },
    { 
      id: 3, 
      name: 'MacBook Air M2', 
      category: 'Laptop', 
      price: 29990000, 
      stock: 0, 
      status: 'out_of_stock',
      image: 'https://via.placeholder.com/50x50'
    },
  ]

  const columns = [
    { 
      title: 'Hình ảnh', 
      dataIndex: 'image', 
      key: 'image',
      render: (image) => <Image width={50} height={50} src={image} alt="product" />
    },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    { 
      title: 'Giá', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`
    },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Còn hàng' : 'Hết hàng'}
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
      title="Quản lý sản phẩm" 
      description="Xem và quản lý danh sách sản phẩm"
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </PageLayout>
  )
}
