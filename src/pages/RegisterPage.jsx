import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  const nav = useNavigate()
  return (
    <>
      <RegisterForm onSuccess={() => nav('/dashboard', { replace: true })} switchToLogin={() => nav('/login')} />
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
      </div>
    </>
  )
}