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
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { authService } from '../services/authService'
import { User, RegisterData, UserRole } from '../types'

interface RegisterPageProps {
  onLogin: (user: User) => void
}

function RegisterPage({ onLogin }: RegisterPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    lastname: '',
    email: '',
    dni: '',
    password: '',
    confirmPassword: '',
    role: 'operador',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    setGeneralError('')
  }

  const handleRoleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as UserRole,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Requerido'
    if (!formData.lastname.trim()) newErrors.lastname = 'Requerido'
    if (!authService.isValidEmail(formData.email)) newErrors.email = 'Email inválido'
    if (!authService.isValidDni(formData.dni)) newErrors.dni = 'DNI debe tener 8 dígitos'
    if (!authService.isValidPassword(formData.password))
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const user = await authService.register(formData)
      if (user) {
        onLogin(user)
        navigate('/')
      } else {
        setGeneralError('El DNI o email ya están registrados, o las contraseñas no coinciden')
      }
    } catch (err) {
      setGeneralError('Error al registrarse')
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
          py: 2,
        }}
      >
        <Card sx={{ width: '100%', p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              📦 LogiTrack
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Crear nueva cuenta
            </Typography>
          </Box>

          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loading}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellido"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                    disabled={loading}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                fullWidth
              />

              <TextField
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                error={!!errors.dni}
                helperText={errors.dni}
                disabled={loading}
                fullWidth
              />

              <FormControl fullWidth disabled={loading}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleRoleChange}
                  label="Rol"
                >
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="operador">Operador</MenuItem>
                  <MenuItem value="transportista">Transportista</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                fullWidth
              />

              <TextField
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Registrarse'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes cuenta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default RegisterPage
