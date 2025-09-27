import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  return (
    <>
      <LoginForm onSuccess={() => nav(from, { replace: true })} switchToRegister={() => nav('/register')} />
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
      </div>
    </>
  )
}
