import { Vehicle } from '../types'

// Mock data de vehículos
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    patente: 'ABC123',
    marca: 'Chevrolet',
    capacidadCarga: 500,
    estado: 'Disponible',
    createdDate: '2026-03-10',
    operator: '1',
  },
  {
    id: '2',
    patente: 'XYZ789',
    marca: 'Ford',
    capacidadCarga: 750,
    estado: 'En uso',
    createdDate: '2026-03-12',
    operator: '1',
  },
]

export const vehicleService = {
  // Obtener todos los vehículos
  getAllVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVehicles), 500)
    })
  },

  // Obtener vehículo por ID
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVehicles.find((v) => v.id === id)), 300)
    })
  },

  // Validar si una patente ya existe
  patenteExists: async (patente: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVehicles.some((v) => v.patente.toUpperCase() === patente.toUpperCase())), 200)
    })
  },

  // Crear nuevo vehículo
  createVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    return new Promise((resolve) => {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: (mockVehicles.length + 1).toString(),
      }
      mockVehicles.push(newVehicle)
      setTimeout(() => resolve(newVehicle), 500)
    })
  },

  // Actualizar estado de vehículo
  updateVehicleStatus: async (id: string, estado: Vehicle['estado']): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      const vehicle = mockVehicles.find((v) => v.id === id)
      if (vehicle) {
        vehicle.estado = estado
      }
      setTimeout(() => resolve(vehicle), 400)
    })
  },

  // Obtener vehículos disponibles
  getAvailableVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(mockVehicles.filter((v) => v.estado === 'Disponible')),
        300,
      )
    })
  },

  // Obtener vehículos por operador
  getVehiclesByOperator: async (operatorId: string): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(mockVehicles.filter((v) => v.operator === operatorId)),
        300,
      )
    })
  },
}
