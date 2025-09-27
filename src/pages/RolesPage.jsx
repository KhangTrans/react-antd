import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Space, Input, Modal, Form, Checkbox, message, Card, Row, Col, Divider, Typography, Popconfirm, Select } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, SafetyOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'
import { authFetch } from '../services/auth'

const { Title, Text } = Typography

export default function RolesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUserModalVisible, setIsUserModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [form] = Form.useForm()

  // Role mapping với backend
  const ROLE_MAP = {
    admin: { id: 1, name: 'ROLE_ADMIN', color: '#ff4d4f' },
    manager: { id: 2, name: 'ROLE_MANAGER', color: '#1890ff' },
    user: { id: 3, name: 'ROLE_USER', color: '#52c41a' }
  }

  // Permissions mapping
  const allPermissions = [
    { key: 'users.read', name: 'Xem người dùng', category: 'Người dùng' },
    { key: 'users.write', name: 'Quản lý người dùng', category: 'Người dùng' },
    { key: 'products.read', name: 'Xem sản phẩm', category: 'Sản phẩm' },
    { key: 'products.write', name: 'Quản lý sản phẩm', category: 'Sản phẩm' },
    { key: 'orders.read', name: 'Xem đơn hàng', category: 'Đơn hàng' },
    { key: 'orders.write', name: 'Quản lý đơn hàng', category: 'Đơn hàng' },
    { key: 'settings.read', name: 'Xem cài đặt', category: 'Hệ thống' },
    { key: 'settings.write', name: 'Quản lý cài đặt', category: 'Hệ thống' },
  ]

  useEffect(() => {
    loadRoles()
    loadUsers()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const res = await authFetch('/api/v1/admin/roles', { method: 'GET' })
      if (!res.ok) {
        // Fallback to mock data if API not available
        const mockRoles = [
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
            name: 'Người dùng', 
            key: 'user', 
            description: 'Xem và xử lý đơn hàng',
            permissions: ['orders.read'],
            userCount: 10
          },
        ]
        setRoles(mockRoles)
        return
      }
      
      const rolesData = await res.json()
      const mappedRoles = (Array.isArray(rolesData) ? rolesData : []).map(role => ({
        id: role.id,
        name: role.name,
        key: role.name?.toLowerCase() || 'user',
        description: role.description || '',
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
        userCount: role.userCount || 0
      }))
      setRoles(mappedRoles)
    } catch (error) {
      console.error('Load roles error:', error)
      // Fallback to mock data
      const mockRoles = [
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
          name: 'Người dùng', 
          key: 'user', 
          description: 'Xem và xử lý đơn hàng',
          permissions: ['orders.read'],
          userCount: 10
        },
      ]
      setRoles(mockRoles)
      message.warning('Sử dụng dữ liệu mẫu - API roles chưa sẵn sàng')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await authFetch('/api/v1/admin/users', { method: 'GET' })
      if (!res.ok) throw new Error('Không tải được danh sách người dùng')
      const list = await res.json()
      setUsers(Array.isArray(list) ? list : [])
    } catch (e) {
      console.error('Load users error:', e)
      // Fallback to empty array
      setUsers([])
    }
  }

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

  const showUserModal = (role) => {
    setSelectedRole(role)
    setIsUserModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissions || []
      }
      
      let res
      if (editingRole) {
        // Update existing role
        res = await authFetch(`/api/v1/admin/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new role
        res = await authFetch('/api/v1/admin/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
      
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
        throw new Error(serverMsg || 'Thao tác thất bại')
      }
      
      message.success(editingRole ? 'Cập nhật vai trò thành công!' : 'Tạo vai trò thành công!')
      setIsModalVisible(false)
      form.resetFields()
      await loadRoles()
    } catch (error) {
      console.error('Role operation error:', error)
      if (error?.message) {
        message.error(error.message)
      } else {
        message.error('Lỗi khi thực hiện thao tác')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleUserModalCancel = () => {
    setIsUserModalVisible(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = async (roleId) => {
    try {
      setLoading(true)
      const res = await authFetch(`/api/v1/admin/roles/${roleId}`, { method: 'DELETE' })
      
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
        throw new Error(serverMsg || 'Xóa vai trò thất bại')
      }
      
      message.success('Xóa vai trò thành công!')
      await loadRoles()
    } catch (error) {
      console.error('Delete role error:', error)
      message.error(error?.message || 'Lỗi khi xóa vai trò')
    } finally {
      setLoading(false)
    }
  }

  const assignRoleToUser = async (userId, roleId) => {
    try {
      const res = await authFetch(`/api/v1/admin/users/${userId}/role/${roleId}`, { method: 'POST' })
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
        throw new Error(serverMsg || 'Gán vai trò thất bại')
      }
      message.success('Đã gán vai trò thành công!')
      await loadUsers()
    } catch (e) {
      console.error('Assign role error', e)
      message.error(e?.message || 'Lỗi khi gán vai trò')
    }
  }

  const removeRoleFromUser = async (userId, roleId) => {
    try {
      const res = await authFetch(`/api/v1/admin/users/${userId}/role/${roleId}`, { method: 'DELETE' })
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
        throw new Error(serverMsg || 'Xóa vai trò thất bại')
      }
      message.success('Đã xóa vai trò thành công!')
      await loadUsers()
    } catch (e) {
      console.error('Remove role error', e)
      message.error(e?.message || 'Lỗi khi xóa vai trò')
    }
  }

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

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Tên vai trò', 
      dataIndex: 'name', 
      key: 'name',
      render: (name, record) => (
        <Space>
          <SettingOutlined style={{ color: ROLE_MAP[record.key]?.color || '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 'bold', color: ROLE_MAP[record.key]?.color || '#262626' }}>
              {name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.key}</div>
          </div>
        </Space>
      )
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description',
      ellipsis: true
    },
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
    { 
      title: 'Số người dùng', 
      dataIndex: 'userCount', 
      key: 'userCount',
      render: (count) => (
        <Tag color="blue" icon={<UserOutlined />}>
          {count} người
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<TeamOutlined />} 
            size="small" 
            type="primary"
            onClick={() => showUserModal(record)}
          >
            Gán vai trò
          </Button>
          <Popconfirm
            title="Xóa vai trò?"
            description="Bạn có chắc chắn muốn xóa vai trò này?"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
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
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          allowClear
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={roles.filter(role => 
          !searchKeyword || 
          role.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          role.key.toLowerCase().includes(searchKeyword.toLowerCase())
        )} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Modal tạo/sửa vai trò */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined style={{ color: '#1890ff' }} />
            <span>{editingRole ? 'Sửa vai trò' : 'Thêm vai trò'}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        confirmLoading={loading}
      >
        <Card style={{ border: 'none', boxShadow: 'none' }}>
          <Form
            form={form}
            layout="vertical"
            size="large"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 500, color: '#262626' }}>
                      <SettingOutlined style={{ marginRight: 4 }} />
                      Tên vai trò
                    </span>
                  }
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
                >
                  <Input placeholder="Nhập tên vai trò" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 500, color: '#262626' }}>
                      <SafetyOutlined style={{ marginRight: 4 }} />
                      Mã vai trò
                    </span>
                  }
                  name="key"
                  rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
                >
                  <Input placeholder="Nhập mã vai trò (vd: admin, manager)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span style={{ fontWeight: 500, color: '#262626' }}>
                  Mô tả
                </span>
              }
              name="description"
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả vai trò" />
            </Form.Item>

            <Divider style={{ margin: '16px 0' }} />

            <Form.Item
              label={
                <span style={{ fontWeight: 500, color: '#262626' }}>
                  Quyền hạn
                </span>
              }
              name="permissions"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền hạn!' }]}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                {Object.entries(
                  allPermissions.reduce((acc, permission) => {
                    if (!acc[permission.category]) acc[permission.category] = []
                    acc[permission.category].push(permission)
                    return acc
                  }, {})
                ).map(([category, permissions]) => (
                  <div key={category} style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ marginBottom: 8, color: '#1890ff' }}>
                      {category}
                    </Title>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {permissions.map(permission => (
                        <Checkbox key={permission.key} value={permission.key}>
                          {permission.name}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Modal gán vai trò cho người dùng */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>Gán vai trò cho người dùng</span>
          </div>
        }
        open={isUserModalVisible}
        onCancel={handleUserModalCancel}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: 6, 
            padding: 12, 
            marginBottom: 16 
          }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              Vai trò: {selectedRole?.name}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {selectedRole?.description}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Danh sách người dùng:</div>
            <Table
              dataSource={users}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              columns={[
                {
                  title: 'Người dùng',
                  key: 'user',
                  render: (_, record) => (
                    <Space>
                      <UserOutlined />
                      <div>
                        <div>{record.fullName || record.name || record.email}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
                      </div>
                    </Space>
                  )
                },
                {
                  title: 'Vai trò hiện tại',
                  key: 'roles',
                  render: (_, record) => (
                    <div>
                      {(Array.isArray(record.roles) ? record.roles : []).map(role => (
                        <Tag key={role} color={getRoleColor(role)} size="small" style={{ marginBottom: 2 }}>
                          {getRoleText(role)}
                        </Tag>
                      ))}
                    </div>
                  )
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => {
                    const hasRole = Array.isArray(record.roles) && record.roles.includes(selectedRole?.key)
                    return (
                      <Space>
                        {hasRole ? (
                          <Button 
                            size="small" 
                            danger 
                            onClick={() => removeRoleFromUser(record.id, ROLE_MAP[selectedRole?.key]?.id)}
                          >
                            Xóa vai trò
                          </Button>
                        ) : (
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => assignRoleToUser(record.id, ROLE_MAP[selectedRole?.key]?.id)}
                          >
                            Gán vai trò
                          </Button>
                        )}
                      </Space>
                    )
                  }
                }
              ]}
            />
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}

