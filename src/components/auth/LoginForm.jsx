import React, { useState } from 'react'
import { Card, Space, Form, Input, Checkbox, Button, Avatar, Typography, Divider, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { signIn, getUserRoles, signOut } from '../../services/auth'

export default function LoginForm({ onSuccess, switchToRegister }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    try {
      setLoading(true)
      await signIn(values)
      // after sign in, check roles: only ROLE_ADMIN and ROLE_MANAGER allowed
      const roles = getUserRoles()
      const allowed = roles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_MANAGER')
      if (!allowed) {
        // logout and show message
        signOut()
        message.error('Bạn không có quyền truy cập trang quản trị')
        return
      }
      message.success('Đăng nhập thành công')
      onSuccess?.()
    } catch (e) {
      message.error(e?.message || 'Thông tin đăng nhập không hợp lệ')
    } finally { setLoading(false) }
  }

  return (
    <Card style={{ maxWidth: 420, width: '100%' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <Typography.Title level={3} style={{ marginTop: 12, marginBottom: 0 }}>Admin Portal</Typography.Title>
          <Typography.Text type="secondary">Đăng nhập để quản trị hệ thống</Typography.Text>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" initialValue>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>Đăng nhập</Button>
        </Form>
        <Divider plain>hoặc</Divider>
        <Button type="link" block onClick={switchToRegister}>Chưa có tài khoản? Đăng ký ngay</Button>
      </Space>
    </Card>
  )
}