import React from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons'

export default function OverviewCards() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Đơn hàng hôm nay" value={128} prefix={<ShoppingCartOutlined />} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Doanh thu" value={487000000} precision={0} prefix={<DollarOutlined />} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Khách mới" value={23} />
        </Card>
      </Col>
    </Row>
  )
}
