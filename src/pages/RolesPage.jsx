import React, { useState } from 'react'
import { Table, Tag, Button, Space, Input, Modal, Form, Checkbox, message } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function RolesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [form] = Form.useForm()

  // Mock data
  const roles = [
    { 
      id: 1, 
      name: 'Quản trị viên', 
      key: 'admin', 
      description: 'Toàn quyền truy cập hệ thống',
      permissions: ['users.read', 'users.write', 'products.read', 'products.write', 'orders.read', 'orders.write', 'settings.read', 'settings.write'],
      userCount: 2
    },
    { 
      id: 2, 
      name: 'Quản lý', 
      key: 'manager', 
      description: 'Quản lý sản phẩm và đơn hàng',
      permissions: ['products.read', 'products.write', 'orders.read', 'orders.write'],
      userCount: 5
    },
    { 
      id: 3, 
      name: 'Nhân viên', 
      key: 'staff', 
      description: 'Xem và xử lý đơn hàng',
      permissions: ['orders.read', 'orders.write'],
      userCount: 10
    },
  ]

  const allPermissions = [
    { key: 'users.read', name: 'Xem người dùng' },
    { key: 'users.write', name: 'Quản lý người dùng' },
    { key: 'products.read', name: 'Xem sản phẩm' },
    { key: 'products.write', name: 'Quản lý sản phẩm' },
    { key: 'orders.read', name: 'Xem đơn hàng' },
    { key: 'orders.write', name: 'Quản lý đơn hàng' },
    { key: 'settings.read', name: 'Xem cài đặt' },
    { key: 'settings.write', name: 'Quản lý cài đặt' },
  ]

  const showModal = (role = null) => {
    setEditingRole(role)
    setIsModalVisible(true)
    if (role) {
      form.setFieldsValue({
        ...role,
        permissions: role.permissions
      })
    } else {
      form.resetFields()
    }
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Role data:', values)
      message.success(editingRole ? 'Cập nhật vai trò thành công!' : 'Tạo vai trò thành công!')
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
      title: 'Tên vai trò', 
      dataIndex: 'name', 
      key: 'name',
      render: (name, record) => (
        <Space>
          <SettingOutlined />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.key}</div>
          </div>
        </Space>
      )
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { 
      title: 'Quyền hạn', 
      dataIndex: 'permissions', 
      key: 'permissions',
      render: (permissions) => (
        <div>
          {permissions.slice(0, 2).map(permission => (
            <Tag key={permission} size="small" style={{ marginBottom: 4 }}>
              {allPermissions.find(p => p.key === permission)?.name || permission}
            </Tag>
          ))}
          {permissions.length > 2 && (
            <Tag size="small" style={{ marginBottom: 4 }}>
              +{permissions.length - 2} khác
            </Tag>
          )}
        </div>
      )
    },
    { title: 'Số người dùng', dataIndex: 'userCount', key: 'userCount' },
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
      title="Quản lý vai trò" 
      description="Quản lý vai trò và quyền hạn trong hệ thống"
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm vai trò
        </Button>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm vai trò..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={roles} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRole ? 'Sửa vai trò' : 'Thêm vai trò'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Tên vai trò"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
          >
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>

          <Form.Item
            label="Mã vai trò"
            name="key"
            rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
          >
            <Input placeholder="Nhập mã vai trò (vd: admin, manager)" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả vai trò" />
          </Form.Item>

          <Form.Item
            label="Quyền hạn"
            name="permissions"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền hạn!' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {allPermissions.map(permission => (
                  <Checkbox key={permission.key} value={permission.key}>
                    {permission.name}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}

