// src/components/layout/Sidebar.jsx
import React, { useMemo, useState } from 'react';
import { Layout, Menu, Switch } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  // theme: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');
  const { pathname } = useLocation();

  // Map URL -> key để highlight item đang active
  const selectedKey = useMemo(() => {
    if (pathname === '/dashboard') return '1';
    if (pathname === '/dashboard/orders') return '2';
    if (pathname === '/dashboard/customers') return '3';
    if (pathname === '/dashboard/reports') return '4';
    if (pathname === '/products') return '5';
    if (pathname === '/inventory') return '6';
    if (pathname === '/promo/campaigns') return '7';
    if (pathname === '/promo/coupons') return '8';
    if (pathname === '/settings') return '9';
    if (pathname === '/settings/profile') return '10';
    if (pathname === '/settings/users') return '11';
    if (pathname === '/settings/roles') return '12';
    return '1';
  }, [pathname]);

  const items = useMemo(
    () => [
      {
        key: 'sub1',
        label: 'Bảng điều khiển',
        icon: <DashboardOutlined />,
        children: [
          { key: '1', label: <Link to="/dashboard">Tổng quan</Link> },
          { key: '2', label: <Link to="/dashboard/orders">Đơn hàng</Link> },
          { key: '3', label: <Link to="/dashboard/customers">Khách hàng</Link> },
          { key: '4', label: <Link to="/dashboard/reports">Báo cáo</Link> },
        ],
      },
      {
        key: 'sub2',
        label: 'Sản phẩm',
        icon: <AppstoreOutlined />,
        children: [
          { key: '5', label: <Link to="/products">Danh sách sản phẩm</Link> },
          { key: '6', label: <Link to="/inventory">Quản lý kho</Link> },
        ],
      },
      {
        key: 'sub3',
        label: 'Khuyến mãi',
        icon: <MailOutlined />,
        children: [
          { key: '7', label: <Link to="/promo/campaigns">Chiến dịch</Link> },
          { key: '8', label: <Link to="/promo/coupons">Mã giảm giá</Link> },
        ],
      },
      {
        key: 'sub4',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
        children: [
          { key: '9', label: <Link to="/settings">Cài đặt hệ thống</Link> },
          { key: '10', label: <Link to="/settings/profile">Thông tin cá nhân</Link> },
          { key: '11', label: <Link to="/settings/users">Quản lý người dùng</Link> },
          { key: '12', label: <Link to="/settings/roles">Quản lý vai trò</Link> },
        ],
      },
    ],
    []
  );

  return (
    <Layout.Sider collapsible>
      <div style={{ color: 'white', padding: 16, fontWeight: 700, letterSpacing: 0.3 }}>
        <DashboardOutlined /> Admin
      </div>
    
      <div style={{ padding: '0 16px 12px', color: theme === 'dark' ? '#fff' : '#000' }}>
        Theme:{' '}
        <Switch
          checked={theme === 'dark'}
          onChange={(v) => setTheme(v ? 'dark' : 'light')}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          size="small"
          style={{ marginLeft: 8 }}
        />
      </div>

      <Menu
        theme={theme}
        mode="inline"
        defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub4']}
        selectedKeys={[selectedKey]}
        items={items}
      />
    </Layout.Sider>
  );
}
