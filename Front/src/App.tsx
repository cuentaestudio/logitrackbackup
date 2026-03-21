import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ShipmentDetail from './pages/ShipmentDetail'
import VehicleDetail from './pages/VehicleDetail'
import Layout from './components/Layout'
import RoutesDashboard from './pages/transportista/RoutesDashboard'
import RouteDetail from './pages/transportista/RouteDetail'
import type { User } from './types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />

        {/* Transportista routes */}
        <Route
          path="/transportista"
          element={
            user?.role === 'transportista' ? (
              <Layout user={user} onLogout={handleLogout} />
            ) : user ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<RoutesDashboard user={user as User} />} />
          <Route path="ruta/:id" element={<RouteDetail />} />
        </Route>

        {/* Admin / Operator routes */}
        <Route
          element={
            user ? (
              user.role === 'transportista' ? (
                <Navigate to="/transportista" />
              ) : (
                <Layout user={user} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/shipment/:id" element={<ShipmentDetail />} />
          <Route path="/vehiculo/:id" element={<VehicleDetail />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
