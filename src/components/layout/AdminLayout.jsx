import React from 'react'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import HeaderBar from './HeaderBar'

export default function AdminLayout({ user, onLogout, children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Layout.Header style={{ background: '#fff' }}>
          <HeaderBar user={user} onLogout={onLogout} />
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          {children}
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Admin Portal • Ant Design + React
        </Layout.Footer>
      </Layout>
    </Layout>
  )
}