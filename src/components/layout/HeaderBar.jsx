import React from 'react'
import { Breadcrumb, Button, Space, Typography } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

export default function HeaderBar({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Breadcrumb items={[{ title: 'Admin' }, { title: 'Dashboard' }]} />
      <Space>
        <Typography.Text>Xin chào, <b>{user?.name || user?.email}</b></Typography.Text>
        <Button icon={<LogoutOutlined />} onClick={onLogout}>Đăng xuất</Button>
      </Space>
    </div>
  )
}