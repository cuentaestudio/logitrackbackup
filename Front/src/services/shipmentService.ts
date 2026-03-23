import type { Shipment } from '../types'
import api from './api'

// Tipos para requests al backend
interface RegistrarPaqueteRequest {
  Peso: number
  Comentarios?: string
  Remitente: {
    Nombre: string
    Apellido: string
    Direccion: string
    Localidad: string
    CP: string
  }
  Destinatario: {
    Nombre: string
    Apellido: string
    Direccion: string
    Localidad: string
    CP: string
  }
}

// Mapear status del backend al frontend
const mapStatus = (status: string): Shipment['status'] => {
  switch (status) {
    case 'EnSucursal': return 'Pendiente'
    case 'EnTransito': return 'En tránsito'
    case 'Entregado': return 'Entregado'
    case 'Cancelado': return 'Cancelado'
    default: return 'Pendiente'
  }
}

// Convertir respuesta del backend a tipo Shipment
const mapToShipment = (paquete: any): Shipment => ({
  id: paquete.id,
  trackingId: paquete.codigoSeguimiento,
  sender: {
    name: `${paquete.remitente.nombre} ${paquete.remitente.apellido}`,
    address: paquete.remitente.direccion.calle,
    city: paquete.remitente.direccion.ciudad,
    postalCode: paquete.remitente.direccion.cp
  },
  receiver: {
    name: `${paquete.destinatario.nombre} ${paquete.destinatario.apellido}`,
    address: paquete.destinatario.direccion.calle,
    city: paquete.destinatario.direccion.ciudad,
    postalCode: paquete.destinatario.direccion.cp
  },
  status: mapStatus(paquete.status),
  origin: paquete.remitente.direccion.ciudad,
  destination: paquete.destinatario.direccion.ciudad,
  createdDate: paquete.createdDate || new Date().toISOString().split('T')[0],
  lastUpdate: paquete.lastUpdate || new Date().toISOString().split('T')[0],
  estimatedDelivery: paquete.estimatedDelivery || '',
  weight: paquete.peso,
  description: paquete.descripcion || '',
  routeId: paquete.routeId
})

export const shipmentService = {
  // Registrar un nuevo paquete
  registerShipment: async (shipment: Omit<Shipment, 'id' | 'trackingId' | 'status' | 'createdDate' | 'lastUpdate' | 'estimatedDelivery' | 'routeId'>): Promise<Shipment | null> => {
    try {
      const request: RegistrarPaqueteRequest = {
        Peso: shipment.weight,
        Comentarios: shipment.description,
        Remitente: {
          Nombre: shipment.sender.name.split(' ')[0],
          Apellido: shipment.sender.name.split(' ').slice(1).join(' '),
          Direccion: shipment.sender.address,
          Localidad: shipment.sender.city,
          CP: shipment.sender.postalCode
        },
        Destinatario: {
          Nombre: shipment.receiver.name.split(' ')[0],
          Apellido: shipment.receiver.name.split(' ').slice(1).join(' '),
          Direccion: shipment.receiver.address,
          Localidad: shipment.receiver.city,
          CP: shipment.receiver.postalCode
        }
      }

      await api.post('/envios/registrar-paquete', request)

      // En una implementación real, el backend debería devolver el paquete creado
      // Por ahora, devolver un objeto simulado
      return {
        ...shipment,
        id: Date.now().toString(),
        trackingId: `LT-${Date.now()}`,
        status: 'Pendiente',
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Register shipment error:', error)
      return null
    }
  },

  // Obtener seguimiento de un paquete
  getShipmentTracking: async (trackingId: string): Promise<Shipment | null> => {
    try {
      const response = await api.get(`/envios/seguimiento/${trackingId}`)
      return mapToShipment(response.data)
    } catch (error) {
      console.error('Get shipment tracking error:', error)
      return null
    }
  },

  // Obtener paquetes en sucursal
  getShipmentsInBranch: async (): Promise<Shipment[]> => {
    try {
      const response = await api.get('/envios/paquetes-en-sucursal')
      return response.data.map(mapToShipment)
    } catch (error) {
      console.error('Get shipments in branch error:', error)
      return []
    }
  },

  // Cambiar estado de paquete
  changeShipmentStatus: async (shipmentId: string, status: string): Promise<boolean> => {
    try {
      await api.post(`/envios/cambiar-estado-paquete/${shipmentId}/estado/${status}`)
      return true
    } catch (error) {
      console.error('Change shipment status error:', error)
      return false
    }
  }
}