import React from 'react'
import { Card, Form, Input, Button, Switch, Select, Divider, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function SettingsPage() {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('Settings saved:', values)
    message.success('Cài đặt đã được lưu thành công!')
  }

  return (
    <PageLayout 
      title="Cài đặt hệ thống" 
      description="Quản lý các cài đặt chung của hệ thống"
    >

      <Card title="Cài đặt chung" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'Admin Portal',
            siteDescription: 'Hệ thống quản lý admin',
            timezone: 'Asia/Ho_Chi_Minh',
            language: 'vi',
            maintenanceMode: false,
            allowRegistration: true,
            emailNotifications: true,
          }}
        >
          <Form.Item
            label="Tên website"
            name="siteName"
            rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}
          >
            <Input placeholder="Nhập tên website" />
          </Form.Item>

          <Form.Item
            label="Mô tả website"
            name="siteDescription"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả website" />
          </Form.Item>

          <Form.Item
            label="Múi giờ"
            name="timezone"
          >
            <Select>
              <Select.Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</Select.Option>
              <Select.Option value="UTC">UTC</Select.Option>
              <Select.Option value="America/New_York">America/New_York</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngôn ngữ"
            name="language"
          >
            <Select>
              <Select.Option value="vi">Tiếng Việt</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item
            label="Chế độ bảo trì"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Cho phép đăng ký"
            name="allowRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Thông báo email"
            name="emailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Cài đặt email">
        <Form layout="vertical">
          <Form.Item
            label="SMTP Host"
            name="smtpHost"
          >
            <Input placeholder="smtp.gmail.com" />
          </Form.Item>

          <Form.Item
            label="SMTP Port"
            name="smtpPort"
          >
            <Input placeholder="587" />
          </Form.Item>

          <Form.Item
            label="Email gửi"
            name="fromEmail"
          >
            <Input placeholder="noreply@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />}>
              Lưu cài đặt email
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageLayout>
  )
}

