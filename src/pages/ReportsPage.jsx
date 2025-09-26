import React from 'react'
import { Card, Row, Col, Statistic, Table } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'

export default function ReportsPage() {

  // Mock data
  const salesData = [
    { month: 'Tháng 1', revenue: 15000000, orders: 120 },
    { month: 'Tháng 2', revenue: 18000000, orders: 145 },
    { month: 'Tháng 3', revenue: 22000000, orders: 168 },
    { month: 'Tháng 4', revenue: 19500000, orders: 152 },
  ]

  const columns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { 
      title: 'Doanh thu', 
      dataIndex: 'revenue', 
      key: 'revenue',
      render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
    },
    { title: 'Số đơn hàng', dataIndex: 'orders', key: 'orders' },
  ]

  return (
    <PageLayout 
      title="Báo cáo thống kê" 
      description="Xem các báo cáo và thống kê tổng quan"
    >

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng này"
              value={22000000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng tháng này"
              value={168}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Khách hàng mới"
              value={45}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn trả"
              value={2.5}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Báo cáo doanh thu theo tháng">
        <Table 
          columns={columns} 
          dataSource={salesData} 
          rowKey="month"
          pagination={false}
        />
      </Card>
    </PageLayout>
  )
}
