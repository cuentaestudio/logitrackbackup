import { Branch } from '../types'

// Mock data de sucursales
let mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Sucursal Centro',
    address: 'Av. Corrientes 1000',
    city: 'Buenos Aires',
    postalCode: '1043',
    phone: '+54 11 1234-5678',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    name: 'Sucursal Norte',
    address: 'Av. Santa Fe 2000',
    city: 'Buenos Aires',
    postalCode: '1123',
    phone: '+54 11 2345-6789',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: '3',
    name: 'Sucursal Sur',
    address: 'Av. 9 de Julio 3000',
    city: 'La Plata',
    postalCode: '1900',
    phone: '+54 221 3456-7890',
    createdDate: new Date().toISOString().split('T')[0],
  },
]

export const branchService = {
  // Obtener todas las sucursales
  getAllBranches: async (): Promise<Branch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockBranches])
      }, 300)
    })
  },

  // Obtener una sucursal por ID
  getBranchById: async (id: string): Promise<Branch | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const branch = mockBranches.find((b) => b.id === id)
        resolve(branch || null)
      }, 300)
    })
  },

  // Crear una nueva sucursal
  createBranch: async (branchData: Omit<Branch, 'id' | 'createdDate'>): Promise<Branch> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBranch: Branch = {
          ...branchData,
          id: (mockBranches.length + 1).toString(),
          createdDate: new Date().toISOString().split('T')[0],
        }
        mockBranches.push(newBranch)
        resolve(newBranch)
      }, 500)
    })
  },

  // Buscar sucursales por nombre
  searchBranches: async (query: string): Promise<Branch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockBranches.filter(
          (b) =>
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.city.toLowerCase().includes(query.toLowerCase()) ||
            b.address.toLowerCase().includes(query.toLowerCase()),
        )
        resolve(filtered)
      }, 300)
    })
  },

  // Verificar si una sucursal existe por nombre
  branchExists: async (name: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = mockBranches.some((b) => b.name.toLowerCase() === name.toLowerCase())
        resolve(exists)
      }, 200)
    })
  },
}
