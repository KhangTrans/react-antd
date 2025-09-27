import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, message, Card, Row, Col, Divider, Typography } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { authFetch } from '../../services/auth'

const { Title, Text } = Typography

export default function AddUserModal({ visible, onClose, onCreated, existingUsers = [] }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const ROLE_MAP = {
    admin: { id: 1, name: 'ROLE_ADMIN', color: '#ff4d4f' },
    manager: { id: 2, name: 'ROLE_MANAGER', color: '#1890ff' },
    user: { id: 3, name: 'ROLE_USER', color: '#52c41a' }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // Kiểm tra email trùng lặp
      const emailLower = String(values.email).toLowerCase()
      if ((existingUsers || []).some(u => String(u.email || '').toLowerCase() === emailLower)) {
        setLoading(false)
        return message.error('Email đã tồn tại trong hệ thống')
      }

      // Chuẩn bị dữ liệu gửi lên server theo UserController
      const payload = {
        fullName: values.name,
        email: values.email,
        password: values.password,
        status: values.status === 'active'
      }

      // Gọi API tạo người dùng qua admin endpoint
      const url = '/api/v1/admin/users'
      try {
        const response = await authFetch(url, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        })
        
        if (!response.ok) {
          throw new Error('Tạo người dùng thất bại')
        }
        
        const userData = await response.json()
        console.log('User created successfully:', userData)
        
      } catch (err) {
        console.error('Create user request failed', err)
        if (err?.body) {
          const serverMsg = err.body?.message || JSON.stringify(err.body)
          throw new Error(`${err.status || ''} ${serverMsg}`.trim())
        }
        if (err?.bodyText) {
          throw new Error(`${err.status || ''} ${String(err.bodyText)}`.trim())
        }
        if (err?.message === 'Network error' || err?.original) {
          throw new Error('Lỗi mạng khi gửi yêu cầu')
        }
        throw err
      }

      message.success('Tạo người dùng thành công!')
      form.resetFields()
      onClose?.()
      onCreated?.()
    } catch (e) {
      console.error('Create user error', e)
      if (e?.message) message.error(e.message)
      else message.error('Lỗi khi tạo người dùng')
    } finally { 
      setLoading(false) 
    }
  }

  const handleCancel = () => { 
    form.resetFields()
    onClose?.() 
  }

  const validatePassword = (_, value) => {
    if (!value) return Promise.resolve()
    if (value.length < 6) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự'))
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'))
    }
    return Promise.resolve()
  }

  const validateConfirmPassword = (_, value) => {
    if (!value) return Promise.resolve()
    if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
    }
    return Promise.resolve()
  }

  return (
    <Modal 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ color: '#1890ff' }} />
          <span>Thêm người dùng mới</span>
        </div>
      }
      open={visible} 
      onCancel={handleCancel} 
      width={700}
      footer={null}
      destroyOnClose
    >
      <Card style={{ border: 'none', boxShadow: 'none' }}>
        <Form 
          form={form} 
          layout="vertical" 
          initialValues={{ role: 'user', status: 'active' }}
          size="large"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    Họ và tên
                  </span>
                }
                name="name" 
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                  { max: 50, message: 'Họ tên không được quá 50 ký tự!' }
                ]}
              >
                <Input 
                  placeholder="Nhập họ và tên đầy đủ" 
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <MailOutlined style={{ marginRight: 4 }} />
                    Email
                  </span>
                }
                name="email" 
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input 
                  placeholder="Nhập địa chỉ email" 
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <SafetyOutlined style={{ marginRight: 4 }} />
                    Vai trò
                  </span>
                }
                name="role" 
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
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
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    Trạng thái
                  </span>
                }
                name="status" 
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">
                    <span style={{ color: '#52c41a' }}>Hoạt động</span>
                  </Select.Option>
                  <Select.Option value="inactive">
                    <span style={{ color: '#ff4d4f' }}>Không hoạt động</span>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '16px 0' }} />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <LockOutlined style={{ marginRight: 4 }} />
                    Mật khẩu
                  </span>
                }
                name="password" 
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { validator: validatePassword }
                ]}
              >
                <Input.Password 
                  placeholder="Nhập mật khẩu" 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={
                  <span style={{ fontWeight: 500, color: '#262626' }}>
                    <LockOutlined style={{ marginRight: 4 }} />
                    Xác nhận mật khẩu
                  </span>
                }
                name="confirmPassword" 
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  { validator: validateConfirmPassword }
                ]}
              >
                <Input.Password 
                  placeholder="Nhập lại mật khẩu" 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: 6, 
            padding: 12, 
            marginBottom: 16 
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <strong>Lưu ý:</strong> Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.
            </Text>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0'
            }}>
              <Button 
                size="large" 
                onClick={handleCancel}
                style={{ minWidth: 100 }}
              >
                Hủy bỏ
              </Button>
              <Button 
                type="primary" 
                size="large" 
                loading={loading} 
                onClick={handleOk}
                style={{ minWidth: 120 }}
                icon={<UserOutlined />}
              >
                Tạo người dùng
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  )
}
