import React, { useState, useEffect, useCallback } from 'react'
import { 
  Table, Tag, Button, Space, Input, message, Card, Row, Col, 
  Typography, Statistic, Image, Switch, Tooltip
} from 'antd'
import { 
  SearchOutlined, ShoppingOutlined, DollarOutlined, 
  ShoppingCartOutlined, ExclamationCircleOutlined, EyeOutlined
} from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'
import { authFetch } from '../services/auth'

const { Title, Text } = Typography

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: (pagination.current - 1).toString(),
        size: pagination.pageSize.toString(),
        search: searchKeyword
      })

      const res = await authFetch(`/api/v1/products?${params}`, { method: 'GET' })
      if (!res.ok) {
        // Fallback to mock data
        const mockProducts = [
          {
            id: 1,
            productName: 'iPhone 15 Pro Max',
            productPrice: 29990000,
            productStock: 50,
            productStatus: true,
            categoryName: 'Điện thoại',
            imageUrl: 'https://via.placeholder.com/150'
          },
          {
            id: 2,
            productName: 'MacBook Pro M3',
            productPrice: 45990000,
            productStock: 25,
            productStatus: true,
            categoryName: 'Laptop',
            imageUrl: 'https://via.placeholder.com/150'
          },
          {
            id: 3,
            productName: 'Samsung Galaxy S24',
            productPrice: 22990000,
            productStock: 0,
            productStatus: false,
            categoryName: 'Điện thoại',
            imageUrl: 'https://via.placeholder.com/150'
          }
        ]
        setProducts(mockProducts)
        setPagination(prev => ({ ...prev, total: mockProducts.length }))
        return
      }

      const data = await res.json()
      setProducts(data.content || [])
      setPagination(prev => ({
        ...prev,
        total: data.totalElements || 0
      }))
    } catch (error) {
      console.error('Load products error:', error)
      message.error('Lỗi tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [pagination, searchKeyword])

  const handleStatusChange = async (productId, status) => {
    try {
      const res = await authFetch(`/api/v1/products/${productId}/status?status=${status}`, { 
        method: 'PATCH' 
      })
      
      if (!res.ok) {
        let serverMsg = null
        try { 
          serverMsg = await res.json()
          serverMsg = serverMsg?.message || JSON.stringify(serverMsg) 
        } catch { 
          try { 
            serverMsg = await res.text() 
          } catch { 
            serverMsg = null 
          } 
        }
        throw new Error(serverMsg || 'Thay đổi trạng thái thất bại')
      }
      
      message.success('Thay đổi trạng thái thành công!')
      await loadProducts()
    } catch (error) {
      console.error('Status change error:', error)
      message.error(error?.message || 'Lỗi khi thay đổi trạng thái')
    }
  }

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }))
  }

  const handleSearch = (value) => {
    setSearchKeyword(value)
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStockColor = (stock) => stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 60
    },
    { 
      title: 'Sản phẩm', 
      key: 'product',
      width: 300,
      render: (_, record) => (
        <Space>
          <Image
            width={60}
            height={60}
            src={record.imageUrl}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 8 }}
          />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {record.productName}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.categoryName}
            </div>
          </div>
        </Space>
      )
    },
    { 
      title: 'Giá', 
      dataIndex: 'productPrice', 
      key: 'price',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatPrice(price)}
        </Text>
      )
    },
    { 
      title: 'Tồn kho', 
      dataIndex: 'productStock', 
      key: 'stock',
      width: 100,
      render: (stock) => (
        <Tag color={getStockColor(stock)}>
          {stock} sản phẩm
        </Tag>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'productStatus', 
      key: 'status',
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="Bán"
          unCheckedChildren="Ẩn"
        />
      )
    }
  ]

  const stats = [
    { title: 'Tổng sản phẩm', value: pagination.total, icon: <ShoppingOutlined />, color: '#1890ff' },
    { title: 'Đang bán', value: products.filter(p => p.productStatus).length, icon: <DollarOutlined />, color: '#52c41a' },
    { title: 'Hết hàng', value: products.filter(p => p.productStock === 0).length, icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
    { title: 'Tồn kho thấp', value: products.filter(p => p.productStock > 0 && p.productStock <= 10).length, icon: <ShoppingCartOutlined />, color: '#faad14' }
  ]

  return (
    <PageLayout 
      title="Danh sách sản phẩm" 
      description="Xem danh sách sản phẩm trong hệ thống"
    >
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>
    </PageLayout>
  )
}