import { User, LoginCredentials, RegisterData } from '../types'

// Mock data de usuarios registrados
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Juan',
    lastname: 'García',
    email: 'juan@example.com',
    dni: '12345678',
    password: 'password123',
  },
]

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.dni === credentials.dni && u.password === credentials.password,
        )
        if (user) {
          const { password, ...userWithoutPassword } = user
          resolve(userWithoutPassword)
        } else {
          resolve(null)
        }
      }, 600)
    })
  },

  // Registro
  register: async (data: RegisterData): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validar que el usuario no exista
        if (mockUsers.find((u) => u.dni === data.dni || u.email === data.email)) {
          resolve(null)
          return
        }

        // Validar contraseñas
        if (data.password !== data.confirmPassword) {
          resolve(null)
          return
        }

        // Crear nuevo usuario
        const newUser: User & { password: string } = {
          id: (mockUsers.length + 1).toString(),
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          dni: data.dni,
          password: data.password,
        }

        mockUsers.push(newUser)

        const { password, ...userWithoutPassword } = newUser
        resolve(userWithoutPassword)
      }, 700)
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
