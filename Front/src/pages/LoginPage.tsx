import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Card,
  Alert,
  CircularProgress,
} from '@mui/material'
import { authService } from '../services/authService'
import { User, LoginCredentials } from '../types'

interface LoginPageProps {
  onLogin: (user: User) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    dni: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validación básica
    if (!credentials.dni || !credentials.password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    if (!authService.isValidDni(credentials.dni)) {
      setError('DNI inválido (debe tener 8 dígitos)')
      setLoading(false)
      return
    }

    try {
      const user = await authService.login(credentials)
      if (user) {
        onLogin(user)
        navigate('/')
      } else {
        setError('DNI o contraseña incorrectos')
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Card sx={{ width: '100%', p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              📦 LogiTrack
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sistema de Gestión de Envíos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="DNI"
                name="dni"
                value={credentials.dni}
                onChange={handleChange}
                placeholder="12345678"
                disabled={loading}
                fullWidth
                autoFocus
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Iniciar sesión'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿No tienes cuenta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ cursor: 'pointer' }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 600 }}>
              Demo - Credenciales de prueba:
            </Typography>
            <Typography variant="caption" display="block">
              DNI: 12345678
            </Typography>
            <Typography variant="caption" display="block">
              Contraseña: password123
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginPage
