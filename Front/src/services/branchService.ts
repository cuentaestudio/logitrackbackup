import type { Branch } from '../types'

// Mock data de sucursales
let mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Sucursal Centro',
    address: 'Av. Corrientes 1000',
    city: 'Buenos Aires',
    postalCode: '1043',
    phone: '+54 11 1234-5678',
    createdDate: '2024-01-15',
    status: 'Activa',
  },
  {
    id: '2',
    name: 'Sucursal Norte',
    address: 'Av. Santa Fe 2000',
    city: 'Buenos Aires',
    postalCode: '1123',
    phone: '+54 11 2345-6789',
    createdDate: '2024-02-10',
    status: 'Activa',
  },
  {
    id: '3',
    name: 'Sucursal Sur',
    address: 'Av. 9 de Julio 3000',
    city: 'La Plata',
    postalCode: '1900',
    phone: '+54 221 3456-7890',
    createdDate: '2024-03-05',
    status: 'Cerrada',
  },
  {
    id: '4',
    name: 'Sucursal Oeste',
    address: 'Av. Rivadavia 5500',
    city: 'Buenos Aires',
    postalCode: '1406',
    phone: '+54 11 4567-8901',
    createdDate: '2024-04-20',
    status: 'Activa',
  },
  {
    id: '5',
    name: 'Sucursal Rosario',
    address: 'Bv. Oroño 1200',
    city: 'Rosario',
    postalCode: '2000',
    phone: '+54 341 5678-9012',
    createdDate: '2024-05-01',
    status: 'No Habilitada',
  },
  {
    id: '6',
    name: 'Sucursal Córdoba',
    address: 'Av. Colón 800',
    city: 'Córdoba',
    postalCode: '5000',
    phone: '+54 351 6789-0123',
    createdDate: '2024-06-12',
    status: 'Activa',
  },
  {
    id: '7',
    name: 'Sucursal Mendoza',
    address: 'Av. San Martín 400',
    city: 'Mendoza',
    postalCode: '5500',
    phone: '+54 261 7890-1234',
    createdDate: '2024-07-08',
    status: 'No Habilitada',
  },
  {
    id: '8',
    name: 'Sucursal Mar del Plata',
    address: 'Av. Independencia 2300',
    city: 'Mar del Plata',
    postalCode: '7600',
    phone: '+54 223 8901-2345',
    createdDate: '2024-08-22',
    status: 'Cerrada',
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
          status: branchData.status ?? 'Activa',
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
