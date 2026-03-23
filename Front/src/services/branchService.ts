import type { Branch } from '../types'
import api from './api'

// Tipos para requests al backend
interface RegistarSucursalRequest {
  Nombre: string
  Direccion: string
  Ciudad: string
  Telefono: string
}

// Convertir respuesta del backend a tipo Branch
export const branchService = {
  // Obtener todas las sucursales
  getAllBranches: async (): Promise<Branch[]> => {
    // El backend no tiene endpoint para obtener sucursales, así que devolver array vacío
    // En una implementación real, se debería agregar un endpoint GET /api/envios/sucursales
    return []
  },

  // Obtener una sucursal por ID
  getBranchById: async (_id: string): Promise<Branch | null> => {
    // Similar, no hay endpoint
    return null
  },

  // Crear una nueva sucursal
  createBranch: async (branchData: Omit<Branch, 'id' | 'createdDate'>): Promise<Branch> => {
    try {
      const request: RegistarSucursalRequest = {
        Nombre: branchData.name,
        Direccion: branchData.address,
        Ciudad: branchData.city,
        Telefono: branchData.phone
      }

      await api.post('/envios/sucursales/registrar-sucursal', request)

      // Devolver objeto simulado
      return {
        ...branchData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Create branch error:', error)
      throw error
    }
  },

  // Buscar sucursales por nombre
  searchBranches: async (_query: string): Promise<Branch[]> => {
    // No hay endpoint de búsqueda, devolver vacío
    return []
  },

  // Verificar si una sucursal existe por nombre
  branchExists: async (_name: string): Promise<boolean> => {
    // No hay endpoint, asumir no existe
    return false
  }
}
