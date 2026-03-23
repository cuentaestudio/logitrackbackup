import type {
  User,
  LoginCredentials,
  RegisterData,
  UserRole,
  TransportistaEstado,
  CreateTransportistaData,
} from '../types'
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
      } as const

      if (data.role === 'transportista') {
        console.error('Transportista public registration is disabled')
        return null
      }

      await api.post('/auth/registrarse', {
        Nombre: data.name,
        Apellido: data.lastname,
        Email: data.email,
        Password: data.password,
        DNI: data.dni,
        Role: roleMap[data.role as 'supervisor' | 'operador']
      })

      // Después del registro, hacer login automáticamente
      return await authService.login({ email: data.email, password: data.password })
    } catch (error: any) {
      console.error('Register error:', error)
      const errorMessage =
        error?.response?.data || error?.message || 'Error al registrarse'
      throw new Error(errorMessage)
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
    return password.length >= 8
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
        role: 'transportista' as const,
        licencia: transportista.licencia,
        estado: (transportista.estado as TransportistaEstado) || 'Activo',
      }))
    } catch (error) {
      console.error('Get transportistas error:', error)
      return []
    }
  },

  // Registrar transportista (solo gestión interna)
  createTransportista: async (data: CreateTransportistaData): Promise<User | null> => {
    try {
      const response = await api.post('/auth/transportistas', {
        Nombre: data.name,
        Apellido: data.lastname,
        DNI: data.dni,
        Licencia: data.licencia,
      })
      const t = response.data
      return {
        id: t.id,
        name: t.nombre,
        lastname: t.apellido,
        email: t.email,
        dni: t.dni,
        role: 'transportista',
        licencia: t.licencia,
        estado: (t.estado as TransportistaEstado) || 'Activo',
      }
    } catch (error) {
      console.error('Create transportista error:', error)
      return null
    }
  },

  updateTransportistaLicencia: async (transportistaId: string, licencia: string): Promise<User | null> => {
    try {
      const response = await api.put(`/auth/transportistas/${transportistaId}/licencia`, {
        Licencia: licencia,
      })
      const t = response.data
      return {
        id: t.id,
        name: t.nombre,
        lastname: t.apellido,
        email: t.email,
        dni: t.dni,
        role: 'transportista',
        licencia: t.licencia,
        estado: (t.estado as TransportistaEstado) || 'Activo',
      }
    } catch (error) {
      console.error('Update transportista licencia error:', error)
      return null
    }
  },

  updateTransportistaEstado: async (transportistaId: string, estado: TransportistaEstado): Promise<User | null> => {
    try {
      const response = await api.put(`/auth/transportistas/${transportistaId}/estado`, {
        Estado: estado,
      })
      const t = response.data
      return {
        id: t.id,
        name: t.nombre,
        lastname: t.apellido,
        email: t.email,
        dni: t.dni,
        role: 'transportista',
        licencia: t.licencia,
        estado: (t.estado as TransportistaEstado) || 'Activo',
      }
    } catch (error) {
      console.error('Update transportista estado error:', error)
      return null
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
        role: usuario.role.toLowerCase() as UserRole,
        licencia: usuario.licencia,
        estado: usuario.estado as TransportistaEstado | undefined,
      }))
    } catch (error) {
      console.error('Get usuarios error:', error)
      return []
    }
  }
}
