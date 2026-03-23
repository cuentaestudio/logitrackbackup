import type { User, LoginCredentials, RegisterData, UserRole } from '../types'
import api from './api'

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const response = await api.post('/auth/login', {
        Email: credentials.email,
        Password: credentials.password
      })

      const token = response.data.token
      const userInfo = response.data.user

      const userId = userInfo?.id ?? userInfo?.Id ?? ''
      const userRoleRaw = userInfo?.role ?? userInfo?.Role ?? ''
      const userRole = String(userRoleRaw).toLowerCase() as UserRole
      
      localStorage.setItem('authToken', token)

      const user: User = {
        id: userId,
        name: userInfo?.nombre ?? userInfo?.Nombre ?? '',
        lastname: userInfo?.apellido ?? userInfo?.Apellido ?? '',
        email: userInfo?.email ?? userInfo?.Email ?? '',
        dni: '',
        role: userRole
      }

      console.log('✓ Login exitoso:', user)
      return user
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  },

  // Registro
  register: async (data: RegisterData): Promise<User | null> => {
    try {
      const roleMap = {
        supervisor: 'Supervisor',
        operador: 'Operador',
        transportista: 'Transportista'
      } as const

      await api.post('/auth/registrarse', {
        Nombre: data.name,
        Apellido: data.lastname,
        Email: data.email,
        Password: data.password,
        DNI: data.dni,
        Role: roleMap[data.role]
      })

      // Después del registro, hacer login automáticamente
      return await authService.login({ email: data.email, password: data.password })
    } catch (error) {
      console.error('Register error:', error)
      return null
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken')
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken')
  },

  // Validar DNI básico (formato argentino)
  isValidDni: (dni: string): boolean => {
    const dniRegex = /^\d{8}$/
    return dniRegex.test(dni)
  },

  // Validar email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validar contraseña
  isValidPassword: (password: string): boolean => {
    return password.length >= 6
  },

  // Obtener transportistas
  getTransportistas: async (): Promise<User[]> => {
    try {
      const response = await api.get('/auth/transportistas')
      return response.data.map((transportista: any) => ({
        id: transportista.id,
        name: transportista.nombre,
        lastname: transportista.apellido,
        email: transportista.email,
        dni: transportista.dni,
        role: 'transportista' as const
      }))
    } catch (error) {
      console.error('Get transportistas error:', error)
      return []
    }
  },

  // Obtener todos los usuarios
  getUsuarios: async (): Promise<User[]> => {
    try {
      const response = await api.get('/auth/usuarios')
      return response.data.map((usuario: any) => ({
        id: usuario.id,
        name: usuario.nombre,
        lastname: usuario.apellido,
        email: usuario.email,
        dni: usuario.dni,
        role: usuario.role.toLowerCase() as UserRole
      }))
    } catch (error) {
      console.error('Get usuarios error:', error)
      return []
    }
  }
}
