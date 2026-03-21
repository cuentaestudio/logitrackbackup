import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ShipmentDetail from './pages/ShipmentDetail'
import Layout from './components/Layout'
import { User } from './types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
        
        <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shipment/:id" element={<ShipmentDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
