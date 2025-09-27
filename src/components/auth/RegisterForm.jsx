import React, { useState } from 'react'
import { Card, Space, Form, Input, Button, Avatar, Typography, Divider, Row, Col, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { signUp } from '../../services/auth'

export default function RegisterForm({ onSuccess, switchToLogin }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    try {
      setLoading(true)
      await signUp(values)
      message.success('Tạo tài khoản thành công')
      onSuccess?.()
    } catch (e) {
      message.error(e?.message || 'Đăng ký thất bại, vui lòng thử lại')
    } finally { setLoading(false) }
  }

  return (
    <Card style={{ maxWidth: 520, width: '100%' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <Typography.Title level={3} style={{ marginTop: 12, marginBottom: 0 }}>Tạo tài khoản quản trị</Typography.Title>
          <Typography.Text type="secondary">Bắt đầu với cổng quản trị của bạn</Typography.Text>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item label="Họ tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input size="large" prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}>
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>Đăng ký</Button>
        </Form>
        <Divider plain>đã có tài khoản?</Divider>
        <Button type="link" block onClick={switchToLogin}>Quay lại đăng nhập</Button>
      </Space>
    </Card>
  )
}