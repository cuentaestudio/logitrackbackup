import type { Vehicle } from '../types'

// Mock data de vehículos
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    patente: 'GHI789',
    marca: 'Chevrolet',
    capacidadCarga: 500,
    estado: 'En uso',
    createdDate: '2026-03-10',
    operator: '1',
    assignedRouteIds: ['1', '4'], // tiene rutas activas → no se puede eliminar
  },
  {
    id: '2',
    patente: 'XYZ789',
    marca: 'Ford',
    capacidadCarga: 750,
    estado: 'En uso',
    createdDate: '2026-03-12',
    operator: '1',
    assignedRouteIds: ['2'], // tiene una ruta activa → no se puede eliminar
  },
  {
    id: '3',
    patente: 'MNO456',
    marca: 'Mercedes',
    capacidadCarga: 1200,
    estado: 'Disponible',
    createdDate: '2026-03-14',
    operator: '1',
    assignedRouteIds: [], // sin rutas → se puede eliminar
  },
  {
    id: '4',
    patente: 'PQR321',
    marca: 'Renault',
    capacidadCarga: 600,
    estado: 'Suspendido',
    createdDate: '2026-03-08',
    operator: '1',
    assignedRouteIds: [], // suspendido, sin rutas activas
  },
  {
    id: '5',
    patente: 'STU654',
    marca: 'Toyota',
    capacidadCarga: 900,
    estado: 'Mantenimiento',
    createdDate: '2026-03-01',
    operator: '1',
    assignedRouteIds: [], // en mantenimiento, sin rutas activas
  },
]

export const vehicleService = {
  // Obtener todos los vehículos
  getAllVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockVehicles]), 500)
    })
  },

  // Obtener vehículo por ID
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVehicles.find((v) => v.id === id)), 300)
    })
  },

  // Validar si una patente ya existe
  patenteExists: async (patente: string, excludeId?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockVehicles.some(
              (v) =>
                v.patente.toUpperCase() === patente.toUpperCase() &&
                v.id !== excludeId,
            ),
          ),
        200,
      )
    })
  },

  // Crear nuevo vehículo
  createVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    return new Promise((resolve) => {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: (mockVehicles.length + 1).toString(),
        assignedRouteIds: [],
      }
      mockVehicles.push(newVehicle)
      setTimeout(() => resolve({ ...newVehicle }), 500)
    })
  },

  // Actualizar estado de vehículo
  updateVehicleStatus: async (
    id: string,
    estado: Vehicle['estado'],
  ): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      const vehicle = mockVehicles.find((v) => v.id === id)
      if (vehicle) {
        vehicle.estado = estado
      }
      setTimeout(() => resolve(vehicle ? { ...vehicle } : undefined), 400)
    })
  },

  // Eliminar vehículo (solo si no tiene rutas asignadas)
  deleteVehicle: async (id: string): Promise<{ success: boolean; reason?: string }> => {
    return new Promise((resolve) => {
      const idx = mockVehicles.findIndex((v) => v.id === id)
      if (idx === -1) {
        return setTimeout(() => resolve({ success: false, reason: 'Vehículo no encontrado' }), 300)
      }
      const vehicle = mockVehicles[idx]
      if (vehicle.assignedRouteIds && vehicle.assignedRouteIds.length > 0) {
        return setTimeout(
          () =>
            resolve({
              success: false,
              reason: 'El vehículo tiene rutas asignadas y no puede ser eliminado',
            }),
          300,
        )
      }
      mockVehicles.splice(idx, 1)
      setTimeout(() => resolve({ success: true }), 400)
    })
  },

  // Verificar si el vehículo tiene rutas asignadas
  hasAssignedRoutes: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const vehicle = mockVehicles.find((v) => v.id === id)
      const result = !!(vehicle?.assignedRouteIds && vehicle.assignedRouteIds.length > 0)
      setTimeout(() => resolve(result), 200)
    })
  },

  // Obtener vehículos disponibles para asignación (excluye Suspendidos y eliminados)
  getAvailableVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockVehicles.filter(
              (v) => v.estado === 'Disponible',
            ),
          ),
        300,
      )
    })
  },

  // Obtener vehículos asignables (Disponible o En uso, excluye Suspendido/Mantenimiento)
  getAssignableVehicles: async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockVehicles.filter(
              (v) => v.estado !== 'Suspendido',
            ),
          ),
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

  // Asignar ruta a un vehículo
  assignRoute: async (vehicleId: string, routeId: string): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      const vehicle = mockVehicles.find((v) => v.id === vehicleId)
      if (vehicle) {
        if (!vehicle.assignedRouteIds) vehicle.assignedRouteIds = []
        if (!vehicle.assignedRouteIds.includes(routeId)) {
          vehicle.assignedRouteIds.push(routeId)
        }
        if (vehicle.estado === 'Disponible') {
          vehicle.estado = 'En uso'
        }
      }
      setTimeout(() => resolve(vehicle ? { ...vehicle } : undefined), 400)
    })
  },

  // Desasignar ruta de un vehículo
  unassignRoute: async (vehicleId: string, routeId: string): Promise<Vehicle | undefined> => {
    return new Promise((resolve) => {
      const vehicle = mockVehicles.find((v) => v.id === vehicleId)
      if (vehicle && vehicle.assignedRouteIds) {
        vehicle.assignedRouteIds = vehicle.assignedRouteIds.filter((id) => id !== routeId)
        if (vehicle.assignedRouteIds.length === 0 && vehicle.estado === 'En uso') {
          vehicle.estado = 'Disponible'
        }
      }
      setTimeout(() => resolve(vehicle ? { ...vehicle } : undefined), 400)
    })
  },
}
