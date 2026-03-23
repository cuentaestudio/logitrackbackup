import type { Route } from '../types'
import api from './api'

// Tipos para requests al backend
interface CrearRutaRequest {
  VehiculoId: string
  TransportistaId: string
  PaqueteIds: string[]
}

// Mapear status del backend al frontend
const mapStatus = (status: string): Route['status'] => {
  switch (status) {
    case 'Creada': return 'Creada'
    case 'EnCurso': return 'En Curso'
    case 'Finalizada': return 'Finalizada'
    case 'Cancelada': return 'Cancelada'
    default: return 'Creada'
  }
}

// Convertir respuesta del backend a tipo Route
const mapToRoute = (ruta: any): Route => ({
  id: ruta.id,
  routeId: ruta.routeId || `R-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
  shipmentIds: ruta.paqueteIds || [],
  vehicleId: ruta.vehiculoId,
  transportistId: ruta.transportistaId,
  status: mapStatus(ruta.status),
  createdDate: ruta.createdDate || new Date().toISOString().split('T')[0],
  startDate: ruta.startDate,
  endDate: ruta.endDate,
  origin: ruta.origin || '',
  destination: ruta.destination || ''
})

export const routeService = {
  // Obtener todas las rutas
  getAllRoutes: async (): Promise<Route[]> => {
    try {
      const response = await api.get('/rutas')
      return response.data.map(mapToRoute)
    } catch (error) {
      console.error('Get all routes error:', error)
      return []
    }
  },

  // Obtener ruta por ID
  getRouteById: async (id: string): Promise<Route | undefined> => {
    try {
      const routes = await routeService.getAllRoutes()
      return routes.find(r => r.id === id)
    } catch (error) {
      console.error('Get route by id error:', error)
      return undefined
    }
  },

  // Crear nueva ruta
  createRoute: async (route: Omit<Route, 'id' | 'routeId' | 'createdDate' | 'startDate' | 'endDate'>): Promise<Route> => {
    try {
      const request: CrearRutaRequest = {
        VehiculoId: route.vehicleId,
        TransportistaId: route.transportistId,
        PaqueteIds: route.shipmentIds
      }

      await api.post('/rutas/crear-ruta', request)

      // Devolver un objeto simulado ya que el backend no devuelve la ruta creada
      return {
        ...route,
        id: Date.now().toString(),
        routeId: `R-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Create route error:', error)
      throw error
    }
  },

  // Comenzar una ruta
  startRoute: async (routeId: string): Promise<Route | undefined> => {
    try {
      await api.post(`/rutas/comenzar-ruta/${routeId}`)
      return await routeService.getRouteById(routeId)
    } catch (error) {
      console.error('Start route error:', error)
      return undefined
    }
  },

  // Finalizar una ruta
  completeRoute: async (routeId: string): Promise<Route | undefined> => {
    try {
      await api.post(`/rutas/finalizar-ruta/${routeId}`)
      return await routeService.getRouteById(routeId)
    } catch (error) {
      console.error('Complete route error:', error)
      return undefined
    }
  },

  // Cancelar una ruta
  cancelRoute: async (routeId: string): Promise<Route | undefined> => {
    try {
      await api.post(`/rutas/cancelar-ruta/${routeId}`, { razon: 'Cancelada desde frontend' })
      return await routeService.getRouteById(routeId)
    } catch (error) {
      console.error('Cancel route error:', error)
      return undefined
    }
  },

  // Reasignar ruta
  reassignRoute: async (routeId: string, transportistId: string): Promise<boolean> => {
    try {
      await api.post(`/rutas/reasignar-ruta/ruta/${routeId}/transportista/${transportistId}`)
      return true
    } catch (error) {
      console.error('Reassign route error:', error)
      return false
    }
  },

  // Obtener historial de rutas
  getRouteHistory: async (): Promise<Route[]> => {
    try {
      const response = await api.get('/rutas/historial')
      return response.data.map(mapToRoute)
    } catch (error) {
      console.error('Get route history error:', error)
      return []
    }
  },

  // Obtener rutas por estado
  getRoutesByStatus: async (status: Route['status']): Promise<Route[]> => {
    try {
      const routes = await routeService.getAllRoutes()
      return routes.filter(r => r.status === status)
    } catch (error) {
      console.error('Get routes by status error:', error)
      return []
    }
  },

  // Asignar transportista a ruta
  assignTransportist: async (routeId: string, transportistId: string): Promise<Route | undefined> => {
    try {
      // Usar el método reassignRoute que ya existe
      const success = await routeService.reassignRoute(routeId, transportistId)
      if (success) {
        return await routeService.getRouteById(routeId)
      }
      return undefined
    } catch (error) {
      console.error('Assign transportist error:', error)
      return undefined
    }
  }
}
