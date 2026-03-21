import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Card,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { authService } from '../services/authService'
import type { User, LoginCredentials } from '../types'

interface LoginPageProps {
  onLogin: (user: User) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const isDev = true
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    dni: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!credentials.dni || !credentials.password) {
      setError('Por favor completá todos los campos')
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
        navigate(user.role === 'transportista' ? '/transportista' : '/app')
      } else {
        setError('DNI o contraseña incorrectos')
      }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (dni: string) => {
    setCredentials({ dni, password: 'password123' })
    setError('')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #0D47A1 0%, #1565C0 40%, #1976d2 70%, #0277BD 100%)',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Brand header above card */}
        <Box sx={{ textAlign: 'center', mb: 3, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <LocalShippingIcon sx={{ fontSize: 36 }} />
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              LogiTrack
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Sistema de Gestión de Envíos
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Card title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Iniciar sesión
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="DNI"
                name="dni"
                value={credentials.dni}
                onChange={handleChange}
                placeholder="12345678"
                disabled={loading}
                fullWidth
                autoFocus
                inputProps={{ maxLength: 10 }}
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
                fullWidth
                sx={{ mt: 0.5, minHeight: 48 }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Ingresando...
                  </Box>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tenés cuenta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600 }}
              >
                Registrate aquí
              </Link>
            </Typography>
          </Box>

          {/* Demo credentials */}
          {isDev && (
            <Box>
              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                  DEMO
                </Typography>
              </Divider>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, textAlign: 'center' }}>
                Clic en un rol para autocompletar · contraseña: <strong>password123</strong>
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label="Supervisor"
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => fillDemo('12345678')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
                <Chip
                  label="Operador"
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={() => fillDemo('87654321')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
                <Chip
                  label="Transportista"
                  color="success"
                  variant="outlined"
                  size="small"
                  onClick={() => fillDemo('11223344')}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
              </Stack>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
   ) 
  

}

export default LoginPage
