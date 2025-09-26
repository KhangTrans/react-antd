import React, { useState } from 'react'
import { Table, Tag, Button, Space, Input, Select, Modal, Form, message, Avatar } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function UsersPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()

  // Mock data
  const users = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      email: 'admin@example.com', 
      role: 'admin', 
      status: 'active',
      lastLogin: '2024-11-15 10:30:00',
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      email: 'manager@example.com', 
      role: 'manager', 
      status: 'active',
      lastLogin: '2024-11-14 15:45:00',
      createdAt: '2024-02-20'
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      email: 'user@example.com', 
      role: 'user', 
      status: 'inactive',
      lastLogin: '2024-11-10 09:15:00',
      createdAt: '2024-03-10'
    },
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red'
      case 'manager': return 'blue'
      case 'user': return 'green'
      default: return 'default'
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên'
      case 'manager': return 'Quản lý'
      case 'user': return 'Người dùng'
      default: return role
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red'
  }

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động'
  }

  const showModal = (user = null) => {
    setEditingUser(user)
    setIsModalVisible(true)
    if (user) {
      form.setFieldsValue(user)
    } else {
      form.resetFields()
    }
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('User data:', values)
      message.success(editingUser ? 'Cập nhật người dùng thành công!' : 'Tạo người dùng thành công!')
      setIsModalVisible(false)
      form.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { 
      title: 'Người dùng', 
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    { 
      title: 'Vai trò', 
      dataIndex: 'role', 
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      )
    },
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
    { title: 'Lần đăng nhập cuối', dataIndex: 'lastLogin', key: 'lastLogin' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageLayout 
      title="Quản lý người dùng" 
      description="Quản lý tài khoản và quyền hạn của người dùng"
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm người dùng
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm người dùng..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Select placeholder="Lọc theo vai trò" style={{ width: 150 }}>
          <Select.Option value="admin">Quản trị viên</Select.Option>
          <Select.Option value="manager">Quản lý</Select.Option>
          <Select.Option value="user">Người dùng</Select.Option>
        </Select>
        <Select placeholder="Lọc theo trạng thái" style={{ width: 150 }}>
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="inactive">Không hoạt động</Select.Option>
        </Select>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: 'user',
            status: 'active'
          }}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Select.Option value="admin">Quản trị viên</Select.Option>
              <Select.Option value="manager">Quản lý</Select.Option>
              <Select.Option value="user">Người dùng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageLayout>
  )
}

