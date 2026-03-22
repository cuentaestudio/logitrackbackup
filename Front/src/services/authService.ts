import type { User, LoginCredentials, RegisterData,UserRole} from '../types'

// Mock data de usuarios registrados
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Juan',
    lastname: 'García',
    email: 'juan@example.com',
    dni: '12345678',
    password: 'password123',
    role: 'supervisor',
  },
  {
    id: '2',
    name: 'María',
    lastname: 'Rodríguez',
    email: 'maria@example.com',
    dni: '87654321',
    password: 'password123',
    role: 'operador',
  },
  {
    id: '3',
    name: 'Carlos',
    lastname: 'López',
    email: 'carlos@example.com',
    dni: '11223344',
    password: 'password123',
    role: 'transportista',
  },
    {
    id: '4',
    name: 'Juan',
    lastname: 'García',
    email: 'juan.transportista@example.com',
    dni: '22334455',
    password: 'password123',
    role: 'transportista',
  },
  {
    id: '5',
    name: 'María',
    lastname: 'Rodríguez',
    email: 'maria.transportista@example.com',
    dni: '33445566',
    password: 'password123',
    role: 'transportista',
  },
  {
    id: '6',
    name: 'Pedro',
    lastname: 'Fernández',
    email: 'pedro.transportista@example.com',
    dni: '44556677',
    password: 'password123',
    role: 'transportista',
  },
]

const sanitizeUser = ({ password, ...user }: User & { password: string }): User => user

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.dni === credentials.dni && u.password === credentials.password,
        )
        
        resolve(user ? sanitizeUser(user) : null)
      }, 600)
    })
  },

  // Registro
  register: async (data: RegisterData): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (mockUsers.find((u) => u.dni === data.dni || u.email === data.email)) {
          resolve(null)
          return
        }

        if (data.password !== data.confirmPassword) {
          resolve(null)
          return
        }

        const newUser: User & { password: string } = {
          id: (mockUsers.length + 1).toString(),
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          dni: data.dni,
          password: data.password,
          role: data.role,
        }

        mockUsers.push(newUser)

       resolve
      }, 700)
    })
  },

  
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.map(sanitizeUser)), 300)
    })
  },

  getUsersByRole: async (role: UserRole): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.filter((user) => user.role === role).map(sanitizeUser)), 300)
    })
  },

  getTransportistas: async (): Promise<User[]> => {
    return authService.getUsersByRole('transportista')
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      const user = mockUsers.find((currentUser) => currentUser.id === id)
      setTimeout(() => resolve(user ? sanitizeUser(user) : undefined), 200)
    })
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
