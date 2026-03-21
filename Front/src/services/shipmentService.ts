import { Shipment } from '../types'

// Mock data de envíos
const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingId: 'LT-2024-001',
    sender: {
      name: 'Juan García',
      address: 'Calle Principal 123',
      city: 'Buenos Aires',
      postalCode: '1425',
    },
    receiver: {
      name: 'María López',
      address: 'Avenida Secundaria 456',
      city: 'La Plata',
      postalCode: '1900',
    },
    status: 'En tránsito',
    origin: 'Buenos Aires',
    destination: 'La Plata',
    createdDate: '2026-03-15',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-22',
    weight: 2.5,
    description: 'Paquete electrónico',
  },
  {
    id: '2',
    trackingId: 'LT-2024-002',
    sender: {
      name: 'Carlos Rodríguez',
      address: 'Calle A 789',
      city: 'Córdoba',
      postalCode: '5000',
    },
    receiver: {
      name: 'Ana Martínez',
      address: 'Calle B 321',
      city: 'Rosario',
      postalCode: '2000',
    },
    status: 'Entregado',
    origin: 'Córdoba',
    destination: 'Rosario',
    createdDate: '2026-03-10',
    lastUpdate: '2026-03-18',
    estimatedDelivery: '2026-03-18',
    weight: 1.8,
    description: 'Documentos importantes',
  },
  {
    id: '3',
    trackingId: 'LT-2024-003',
    sender: {
      name: 'Pedro Silva',
      address: 'Calle C 555',
      city: 'Mendoza',
      postalCode: '5500',
    },
    receiver: {
      name: 'Laura Fernández',
      address: 'Calle D 777',
      city: 'San Juan',
      postalCode: '5400',
    },
    status: 'En tránsito',
    origin: 'Mendoza',
    destination: 'San Juan',
    createdDate: '2026-03-19',
    lastUpdate: '2026-03-21',
    estimatedDelivery: '2026-03-24',
    weight: 3.2,
    description: 'Paquete frágil - Manejo cuidadoso',
  },
  {
    id: '4',
    trackingId: 'LT-2024-004',
    sender: {
      name: 'Roberto Guzmán',
      address: 'Calle E 888',
      city: 'Bahía Blanca',
      postalCode: '8000',
    },
    receiver: {
      name: 'Sofía Torres',
      address: 'Calle F 999',
      city: 'Mar del Plata',
      postalCode: '7600',
    },
    status: 'Cancelado',
    origin: 'Bahía Blanca',
    destination: 'Mar del Plata',
    createdDate: '2026-03-05',
    lastUpdate: '2026-03-12',
    estimatedDelivery: '2026-03-17',
    weight: 2.1,
    description: 'Paquete cancelado por solicitud del cliente',
    cancellationReason: 'Solicitud del cliente - cambio de dirección',
  },
]

// Generar tracking ID único
const generateTrackingId = (): string => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(6, '0')
  return `LT-${date}-${random}`
}

export const shipmentService = {
  // Generar nuevo tracking ID
  generateTrackingId: async (): Promise<string> => {
    return new Promise((resolve) => {
      let trackingId = generateTrackingId()
      // Asegurar que sea único
      while (mockShipments.some((s) => s.trackingId === trackingId)) {
        trackingId = generateTrackingId()
      }
      setTimeout(() => resolve(trackingId), 100)
    })
  },

  // Validar si un tracking ID ya existe
  trackingIdExists: async (trackingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.some((s) => s.trackingId === trackingId)), 200)
    })
  },

  // Obtener todos los envíos
  getAllShipments: async (): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments), 500)
    })
  },

  // Obtener envío por ID
  getShipmentById: async (id: string): Promise<Shipment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.find((s) => s.id === id)), 300)
    })
  },

  // Buscar envíos por tracking ID
  searchByTrackingId: async (trackingId: string): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockShipments.filter((s) =>
              s.trackingId.toLowerCase().includes(trackingId.toLowerCase()),
            ),
          ),
        400,
      )
    })
  },

  // Crear nuevo envío
  createShipment: async (shipment: Omit<Shipment, 'id' | 'lastUpdate'>): Promise<Shipment> => {
    return new Promise((resolve) => {
      const newShipment: Shipment = {
        ...shipment,
        id: (mockShipments.length + 1).toString(),
        lastUpdate: new Date().toISOString().split('T')[0],
      }
      mockShipments.push(newShipment)
      setTimeout(() => resolve(newShipment), 500)
    })
  },

  // Actualizar estado de envío
  updateShipmentStatus: async (
    id: string,
    status: Shipment['status'],
    cancellationReason?: string,
  ): Promise<Shipment | undefined> => {
    return new Promise((resolve) => {
      const shipment = mockShipments.find((s) => s.id === id)
      if (shipment) {
        shipment.status = status
        shipment.lastUpdate = new Date().toISOString().split('T')[0]
        
        // Si es cancelado, agregar motivo
        if (status === 'Cancelado' && cancellationReason) {
          shipment.cancellationReason = cancellationReason
        } else if (status !== 'Cancelado') {
          // Limpiar motivo si no es cancelado
          shipment.cancellationReason = undefined
        }
      }
      setTimeout(() => resolve(shipment), 400)
    })
  },

  // Obtener envíos recientes
  getRecentShipments: async (limit: number = 5): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.slice(0, limit)), 300)
    })
  },
}
