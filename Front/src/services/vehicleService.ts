import type { Vehicle } from '../types'
import api from './api'

// Tipos para requests al backend
interface RegistrarVehiculoRequest {
  Patente: string
  Modelo: string
  Capacidad: number
}

// Mapear estado del backend al frontend
const mapEstado = (estado: string): Vehicle['estado'] => {
  switch (estado) {
    case 'Disponible': return 'Disponible'
    case 'EnUso': return 'En uso'
    case 'Mantenimiento': return 'Mantenimiento'
    case 'Suspendido': return 'Suspendido'
    default: return 'Disponible'
  }
}

// Convertir respuesta del backend a tipo Vehicle
const mapToVehicle = (vehiculo: any): Vehicle => ({
  id: vehiculo.id,
  patente: vehiculo.patente,
  marca: vehiculo.modelo, // Asumiendo que modelo incluye marca
  capacidadCarga: vehiculo.capacidad,
  estado: mapEstado(vehiculo.estado),
  createdDate: vehiculo.createdDate || new Date().toISOString().split('T')[0],
  operator: vehiculo.operator,
  assignedRouteIds: vehiculo.assignedRouteIds || []
})

export const vehicleService = {
  // Obtener todos los vehículos
  getAllVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await api.get('/envios/vehiculos/activos')
      return response.data.map(mapToVehicle)
    } catch (error) {
      console.error('Get all vehicles error:', error)
      return []
    }
  },

  // Obtener vehículo por ID
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    try {
      const vehicles = await vehicleService.getAllVehicles()
      return vehicles.find(v => v.id === id)
    } catch (error) {
      console.error('Get vehicle by id error:', error)
      return undefined
    }
  },

  // Validar si una patente ya existe
  patenteExists: async (patente: string, excludeId?: string): Promise<boolean> => {
    try {
      const vehicles = await vehicleService.getAllVehicles()
      return vehicles.some(v => v.patente.toUpperCase() === patente.toUpperCase() && v.id !== excludeId)
    } catch (error) {
      console.error('Check patente exists error:', error)
      return false
    }
  },

  // Crear nuevo vehículo
  createVehicle: async (vehicle: Omit<Vehicle, 'id' | 'assignedRouteIds'>): Promise<Vehicle> => {
    try {
      const request: RegistrarVehiculoRequest = {
        Patente: vehicle.patente,
        Modelo: vehicle.marca, // Usando marca como modelo
        Capacidad: vehicle.capacidadCarga
      }

      await api.post('/envios/vehiculos/registrar-vehiculo', request)

      // Devolver objeto simulado
      return {
        ...vehicle,
        id: Date.now().toString(),
        assignedRouteIds: []
      }
    } catch (error) {
      console.error('Create vehicle error:', error)
      throw error
    }
  },

  // Obtener vehículos asignables (disponibles)
  getAssignableVehicles: async (): Promise<Vehicle[]> => {
    try {
      const vehicles = await vehicleService.getAllVehicles()
      return vehicles.filter(v => v.estado === 'Disponible')
    } catch (error) {
      console.error('Get assignable vehicles error:', error)
      return []
    }
  },

  // Obtener vehículos por operador
  getVehiclesByOperator: async (operatorId: string): Promise<Vehicle[]> => {
    try {
      const vehicles = await vehicleService.getAllVehicles()
      return vehicles.filter(v => v.operator === operatorId)
    } catch (error) {
      console.error('Get vehicles by operator error:', error)
      return []
    }
  }
}