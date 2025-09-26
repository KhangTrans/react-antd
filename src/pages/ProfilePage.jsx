import React from 'react'
import { Card, Form, Input, Button, Avatar, Upload, message } from 'antd'
import { UserOutlined, CameraOutlined, SaveOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'
import { getCurrentUser } from '../services/auth'

export default function ProfilePage() {
  const user = getCurrentUser()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('Profile updated:', values)
    message.success('Thông tin cá nhân đã được cập nhật!')
  }

  const uploadProps = {
    name: 'avatar',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <PageLayout 
      title="Thông tin cá nhân" 
      description="Cập nhật thông tin cá nhân và tài khoản của bạn"
    >

      <div style={{ display: 'flex', gap: 24 }}>
        <Card title="Ảnh đại diện" style={{ width: 300 }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
            <div>
              <Upload {...uploadProps}>
                <Button icon={<CameraOutlined />}>
                  Thay đổi ảnh
                </Button>
              </Upload>
            </div>
          </div>
        </Card>

        <Card title="Thông tin cá nhân" style={{ flex: 1 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: user?.name || '',
              email: user?.email || '',
              phone: '',
              address: '',
              bio: '',
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
              label="Số điện thoại"
              name="phone"
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
            >
              <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              label="Giới thiệu"
              name="bio"
            >
              <Input.TextArea rows={4} placeholder="Giới thiệu về bản thân" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Card title="Đổi mật khẩu" style={{ marginTop: 24 }}>
        <Form layout="vertical">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />}>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageLayout>
  )
}

