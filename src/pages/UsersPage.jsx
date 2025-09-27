import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Input, Select, Modal, message, Avatar, Popconfirm } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'
import { authFetch } from '../services/auth'
import AddUserModal from '../components/users/AddUserModal'

export default function UsersPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false)
  const [roleUpdating, setRoleUpdating] = useState(false)
  // NOTE: backend AdminUserController expects roleId for add/remove role endpoints.
  const ROLE_MAP = {
    admin: { id: 1, name: 'ROLE_ADMIN' },
    manager: { id: 2, name: 'ROLE_MANAGER' },
    user: { id: 3, name: 'ROLE_USER' }
  }
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterRole, setFilterRole] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const res = await authFetch('/api/v1/admin/users', { method: 'GET' })
      if (!res.ok) throw new Error('Không tải được danh sách người dùng')
      const list = await res.json()
      const mapped = (Array.isArray(list) ? list : []).map(u => ({
        id: u.id,
        name: u.fullName || u.name || u.email,
        email: u.email,
        roles: Array.isArray(u.roles) && u.roles.length ? u.roles.map(r => {
          const raw = typeof r === 'string' ? r : (r?.name || r?.role || '')
          return String(raw).replace(/^ROLE_/, '').toLowerCase()
        }) : ['user'],
        status: u.status === true || u.status === 'active' ? 'active' : 'inactive'
      }))
      setUsers(mapped)
    } catch (e) {
      message.error(e?.message || 'Lỗi tải người dùng')
    } finally { setLoading(false) }
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

  const getStatusColor = (status) => status === 'active' ? 'green' : 'red'
  const getStatusText = (status) => status === 'active' ? 'Hoạt động' : 'Không hoạt động'

  const showModal = () => { setEditingUser(null); setIsModalVisible(true) }
  // Role-only modal handlers
  const openRoleModal = (user) => {
     const selected = Array.isArray(user?.roles) && user.roles.length ? user.roles[0] : 'user'
     setEditingUser({ ...user, selectedRole: selected })
     setIsRoleModalVisible(true)
  }

  // Quản lý vai trò sử dụng AdminUserController endpoints
  const addRoleToUser = async (roleKey) => {
    if (!editingUser) return
    const role = ROLE_MAP[roleKey]
    if (!role) return message.error('Vai trò không hợp lệ')
    try {
      setRoleUpdating(true)
      const endpoint = `/api/v1/admin/users/${editingUser.id}/role/${role.id}`
      const res = await authFetch(endpoint, { method: 'POST' })
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
        throw new Error(serverMsg || 'Thêm vai trò thất bại')
      }
      message.success('Đã thêm vai trò thành công!')
      setIsRoleModalVisible(false)
      setEditingUser(null)
      await loadUsers()
    } catch (e) {
      console.error('Add role error', e)
      message.error(e?.message || 'Lỗi khi thêm vai trò')
    } finally { 
      setRoleUpdating(false) 
    }
  }

  const removeRoleFromUser = async (roleKey) => {
    if (!editingUser) return
    const role = ROLE_MAP[roleKey]
    if (!role) return message.error('Vai trò không hợp lệ')
    try {
      setRoleUpdating(true)
      const endpoint = `/api/v1/admin/users/${editingUser.id}/role/${role.id}`
      const res = await authFetch(endpoint, { method: 'DELETE' })
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
      setIsRoleModalVisible(false)
      setEditingUser(null)
      await loadUsers()
    } catch (e) {
      console.error('Remove role error', e)
      message.error(e?.message || 'Lỗi khi xóa vai trò')
    } finally { 
      setRoleUpdating(false) 
    }
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
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {(Array.isArray(roles) ? roles : []).map(r => (
            <Tag key={r} color={getRoleColor(r)}>{getRoleText(r)}</Tag>
          ))}
        </>
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
  // Removed lastLogin and createdAt columns as requested
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openRoleModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa người dùng?" okText="Xóa" cancelText="Hủy" onConfirm={async () => {
            try {
              setLoading(true)
              const res = await authFetch(`/api/v1/admin/users/${record.id}`, { method: 'DELETE' })
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
                throw new Error(serverMsg || 'Xóa người dùng thất bại')
              }
              message.success('Đã xóa người dùng thành công!')
              await loadUsers()
            } catch (err) { 
              console.error('Delete user error', err)
              message.error(err?.message || 'Lỗi khi xóa người dùng') 
            } finally { 
              setLoading(false) 
            }
          }}>
            <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
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
          onSearch={(v) => setSearchKeyword(v || '')}
          allowClear
        />
        <Select placeholder="Lọc theo vai trò" style={{ width: 150 }} onChange={(v) => setFilterRole(v)} allowClear>
          <Select.Option value="admin">Quản trị viên</Select.Option>
          <Select.Option value="manager">Quản lý</Select.Option>
          <Select.Option value="user">Người dùng</Select.Option>
        </Select>
        <Select placeholder="Lọc theo trạng thái" style={{ width: 150 }} onChange={(v) => setFilterStatus(v)} allowClear>
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="inactive">Không hoạt động</Select.Option>
        </Select>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users
          .filter(u => {
            if (searchKeyword) {
              const k = searchKeyword.toLowerCase()
              if (!((u.name || '').toLowerCase().includes(k) || (u.email || '').toLowerCase().includes(k))) return false
            }
              if (filterRole && !(Array.isArray(u.roles) && u.roles.includes(filterRole))) return false
            if (filterStatus && u.status !== filterStatus) return false
            return true
          })
        } 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

  {/* Role management modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyOutlined style={{ color: '#1890ff' }} />
            <span>Quản lý vai trò</span>
          </div>
        }
        open={isRoleModalVisible}
        onCancel={() => { setIsRoleModalVisible(false); setEditingUser(null) }}
        footer={null}
        width={600}
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
              Người dùng: {editingUser?.name || editingUser?.email}
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Email: {editingUser?.email}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Vai trò hiện tại:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {(Array.isArray(editingUser?.roles) ? editingUser.roles : []).map(role => (
                <Tag key={role} color={getRoleColor(role)} style={{ marginBottom: 4 }}>
                  {getRoleText(role)}
                </Tag>
              ))}
              {(!editingUser?.roles || editingUser.roles.length === 0) && (
                <Tag color="default">Chưa có vai trò</Tag>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Chọn vai trò để thêm/xóa:</div>
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Chọn vai trò"
              value={editingUser?.selectedRole || 'user'}
              onChange={(v) => setEditingUser(prev => ({ ...prev, selectedRole: v }))}
            >
              <Select.Option value="admin">
                <span style={{ color: ROLE_MAP.admin.color, fontWeight: 500 }}>
                  Quản trị viên
                </span>
              </Select.Option>
              <Select.Option value="manager">
                <span style={{ color: ROLE_MAP.manager.color, fontWeight: 500 }}>
                  Quản lý
                </span>
              </Select.Option>
              <Select.Option value="user">
                <span style={{ color: ROLE_MAP.user.color, fontWeight: 500 }}>
                  Người dùng
                </span>
              </Select.Option>
            </Select>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 12, 
            justifyContent: 'flex-end',
            paddingTop: 16,
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              size="large" 
              onClick={() => { setIsRoleModalVisible(false); setEditingUser(null) }}
              style={{ minWidth: 100 }}
            >
              Hủy bỏ
            </Button>
            <Button 
              danger 
              size="large" 
              loading={roleUpdating} 
              onClick={() => removeRoleFromUser(editingUser?.selectedRole || 'user')}
              style={{ minWidth: 120 }}
            >
              Xóa vai trò
            </Button>
            <Button 
              type="primary" 
              size="large" 
              loading={roleUpdating} 
              onClick={() => addRoleToUser(editingUser?.selectedRole || 'user')}
              style={{ minWidth: 120 }}
            >
              Thêm vai trò
            </Button>
          </div>
        </div>
      </Modal>

      <AddUserModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onCreated={async () => { setIsModalVisible(false); await loadUsers() }} existingUsers={users} />
    </PageLayout>
  )
}

