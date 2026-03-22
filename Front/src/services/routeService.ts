import type { Route } from '../types'
import { shipmentService } from './shipmentService'
import { vehicleService } from './vehicleService'
// Mock data de rutas
const mockRoutes: Route[] = [
  {
    id: '1',
    routeId: 'R-20260321-001',
    shipmentIds: ['1', '3'],
    vehicleId: '1',
    transportistId: '3',
    status: 'En Curso',
    createdDate: '2026-03-15',
    startDate: '2026-03-20',
    origin: 'Buenos Aires',
    destination: 'La Plata',
  },
  {
    id: '2',
    routeId: 'R-20260321-002',
    shipmentIds: ['2'],
    vehicleId: '2',
    transportistId: '4',
    status: 'Creada',
    createdDate: '2026-03-21',
    origin: 'Córdoba',
    destination: 'Rosario',
  },
  {
    id: '3',
    routeId: 'R-20260320-003',
    shipmentIds: ['4', '5', '6'],
    vehicleId: '3',
    transportistId: '5',
    status: 'Finalizada',
    createdDate: '2026-03-19',
    startDate: '2026-03-19',
    endDate: '2026-03-20',
    origin: 'Mendoza',
    destination: 'San Juan',
  },
  {
    id: '4',
    routeId: 'R-20260321-004',
    shipmentIds: ['7', '8'],
    vehicleId: '1',
    transportistId: '6',
    status: 'Cancelada',
    createdDate: '2026-03-20',
    origin: 'Bahía Blanca',
    destination: 'Mar del Plata',
  },
]

const cloneRoute = (route: Route): Route => ({
  ...route,
  shipmentIds: [...route.shipmentIds],
})

export const routeService = {
  // Obtener todas las rutas
  getAllRoutes: async (): Promise<Route[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRoutes.map((cloneRoute))), 500)
    })
  },

  // Obtener ruta por ID
  getRouteById: async (id: string): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === id)
      setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 300)
    })
  },

  // Generar nuevo route ID
  generateRouteId: (): string => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const sequential = mockRoutes.length + 1
    return `R-${date}-${sequential.toString().padStart(3, '0')}`
  },

  // Crear nueva ruta (Supervisor)
  createRoute: async (route: Omit<Route, 'id' | 'routeId'>): Promise<Route> => {
    return new Promise((resolve, reject) => {
      const selectedShipments = new Set(route.shipmentIds)
      const alreadyAssigned = mockRoutes.some((existingRoute) =>
        existingRoute.status !== 'Cancelada' &&
        existingRoute.shipmentIds.some((shipmentId) => selectedShipments.has(shipmentId)),
      )

      if (alreadyAssigned) {
        setTimeout(() => reject(new Error('Uno o más envíos ya fueron asignados a otra ruta activa.')), 250)
        return
      }

      const newRoute: Route = {
        ...route,
        id: (mockRoutes.length + 1).toString(),
        routeId: routeService.generateRouteId(),
      }
      mockRoutes.push(newRoute)
      Promise.all([
        shipmentService.assignShipmentsToRoute(route.shipmentIds, newRoute.id),
        vehicleService.assignRoute(route.vehicleId, newRoute.id),
      ]).finally(() => {
        setTimeout(() => resolve(cloneRoute(newRoute)), 500)
      })
    })
  },

  assignTransportist: async (routeId: string, transportistId: string): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId)
      if (route && route.status === 'Creada') {
        route.transportistId = transportistId
      }
      setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 350)
    })
  },

  // Comenzar una ruta (Transportista)
  startRoute: async (routeId: string): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId)
      if (route && route.status === 'Creada') {
        route.status = 'En Curso'
        route.startDate = new Date().toISOString().split('T')[0]
      }
      setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 400)
    })
  },

  // Completar una ruta (Transportista)
  completeRoute: async (routeId: string): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId)
      if (route && route.status === 'En Curso') {
        route.status = 'Finalizada'
        route.endDate = new Date().toISOString().split('T')[0]
      }
     setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 400)
    })
  },

  // Cancelar una ruta (Transportista)
  cancelRoute: async (routeId: string): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId)
      if (route && (route.status === 'Creada' || route.status === 'En Curso')) {
        route.status = 'Cancelada'
      }
     setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 400)
    })
  },

  // Filtrar rutas por estado
  getRoutesByStatus: async (status: Route['status']): Promise<Route[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockRoutes.filter((r) => r.status === status).map(cloneRoute)), 300)
    })
  },

  // Obtener rutas de un transportista
  getRoutesByTransportist: async (transportistId: string): Promise<Route[]> => {
    return new Promise((resolve) => {
      setTimeout(
       () => resolve(mockRoutes.filter((r) => r.transportistId === transportistId).map(cloneRoute)),
        300,
      )
    })
  },

  // Actualizar ruta
  updateRoute: async (id: string, updates: Partial<Route>): Promise<Route | undefined> => {
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === id)
      if (route) {
        Object.assign(route, updates)
      }
            setTimeout(() => resolve(route ? cloneRoute(route) : undefined), 400)
    })
  },
}
