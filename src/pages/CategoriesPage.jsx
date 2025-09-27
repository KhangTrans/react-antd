import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Input, Modal, Form, Switch, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PageLayout from '../components/layout/PageLayout'
import { authFetch } from '../services/auth'

export default function CategoriesPage() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [keyword, setKeyword] = useState('')

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const res = await authFetch('/api/v1/categories')
      if (!res.ok) throw new Error('Không tải được danh mục')
      const data = await res.json()
      const mapped = (Array.isArray(data) ? data : []).map(c => ({
        id: c.id,
        name: c.categoryName,
        status: c.categoryStatus ? 'active' : 'inactive',
        products: Array.isArray(c.products) ? c.products : []
      }))
      setCategories(mapped)
    } catch (e) {
      message.error(e?.message || 'Lỗi tải danh mục')
    } finally { setLoading(false) }
  }

  function showModal(cat = null) {
    setEditing(cat)
    setIsModalVisible(true)
    if (cat) form.setFieldsValue({ name: cat.name, status: cat.status === 'active' })
    else form.resetFields()
  }

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      // Backend expects Category entity fields in request body (likely name, status)
      const payload = { name: values.name, status: !!values.status }
      let res
      if (editing) {
        res = await authFetch(`/api/v1/categories/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
      } else {
        res = await authFetch('/api/v1/categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
      }
      if (!res.ok) throw new Error('Lưu danh mục thất bại')
      message.success('Lưu danh mục thành công')
      setIsModalVisible(false)
      setEditing(null)
      loadCategories()
    } catch (e) {
      if (e?.errorFields) return
      message.error(e?.message || 'Lỗi lưu danh mục')
    }
  }

  async function toggleStatus(cat) {
    try {
      const next = cat.status !== 'active'
      const res = await authFetch(`/api/v1/categories/${cat.id}/status?status=${next}`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Đổi trạng thái thất bại')
      message.success('Cập nhật trạng thái thành công')
      loadCategories()
    } catch (e) { message.error(e?.message || 'Lỗi cập nhật') }
  }

  async function deleteCategory(cat) {
    try {
      const res = await authFetch(`/api/v1/categories/${cat.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Xóa danh mục thất bại')
      message.success('Đã xóa danh mục')
      loadCategories()
    } catch (e) { message.error(e?.message || 'Lỗi xóa danh mục') }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    { title: 'Số sản phẩm', key: 'count', render: (_, r) => r.products.length },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Ngừng'}</Tag>
      )
    },
    {
      title: 'Hành động', key: 'action', width: 280,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>Sửa</Button>
          <Switch checked={record.status === 'active'} onChange={() => toggleStatus(record)} />
          <Popconfirm title="Xóa danh mục?" okText="Xóa" cancelText="Hủy" onConfirm={() => deleteCategory(record)}>
            <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const filtered = keyword
    ? categories.filter(c => c.name?.toLowerCase().includes(keyword.toLowerCase()))
    : categories

  return (
    <PageLayout title="Quản lý danh mục" description="Tạo và quản lý danh mục sản phẩm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm danh mục</Button>
        <Input.Search placeholder="Tìm kiếm danh mục" style={{ width: 320 }} onSearch={setKeyword} allowClear />
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal title={editing ? 'Sửa danh mục' : 'Thêm danh mục'} open={isModalVisible} onOk={handleSubmit} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}>
            <Input placeholder="Ví dụ: Điện thoại" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" valuePropName="checked" initialValue>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}


