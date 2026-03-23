import type { User, LoginCredentials, RegisterData, UserRole } from '../types'
import api from './api'

// Tipos para las respuestas del backend
interface LoginResponse {
  token: string
}

interface RegisterRequest {
  Nombre: string
  Apellido: string
  Email: string
  Password: string
  DNI: string
  Role: 'Supervisor' | 'Operador' | 'Transportista'
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        Email: credentials.email,
        Password: credentials.password
      })

      const token = response.data.token
      localStorage.setItem('authToken', token)

      // Decodificar el token para obtener la info del usuario
      // Nota: En producción, usar una librería como jwt-decode
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user: User = {
        id: payload['nameid'],
        name: payload['unique_name'].split(' ')[0],
        lastname: payload['unique_name'].split(' ')[1] || '',
        email: payload.email,
        dni: '', // El backend no devuelve DNI en el token
        role: payload.role.toLowerCase() as UserRole
      }

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
}
