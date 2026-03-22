import type { Shipment } from '../types'

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
    routeId: '1',
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
    status: 'Pendiente',
    origin: 'Córdoba',
    destination: 'Rosario',
    createdDate: '2026-03-10',
    lastUpdate: '2026-03-21',
    estimatedDelivery: '2026-03-25',
    weight: 1.8,
    description: 'Documentos importantes',
    routeId: '2',
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
    routeId: '1',
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
    status: 'Entregado',
    origin: 'Bahía Blanca',
    destination: 'Mar del Plata',
    createdDate: '2026-03-05',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-17',
    weight: 2.1,
    description: 'Electrodoméstico pequeño',
    routeId: '3',
  },
  {
    id: '5',
    trackingId: 'LT-2024-005',
    sender: {
      name: 'Elena Campos',
      address: 'Av. San Martín 400',
      city: 'Mendoza',
      postalCode: '5500',
    },
    receiver: {
      name: 'Diego Romero',
      address: 'Belgrano 1200',
      city: 'San Juan',
      postalCode: '5400',
    },
    status: 'Entregado',
    origin: 'Mendoza',
    destination: 'San Juan',
    createdDate: '2026-03-18',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-20',
    weight: 0.8,
    description: 'Sobre documentos',
    routeId: '3',
  },
  {
    id: '6',
    trackingId: 'LT-2024-006',
    sender: {
      name: 'Marcelo Vega',
      address: 'Corrientes 2200',
      city: 'Buenos Aires',
      postalCode: '1045',
    },
    receiver: {
      name: 'Natalia Sosa',
      address: 'Rivadavia 800',
      city: 'San Juan',
      postalCode: '5400',
    },
    status: 'Rechazado',
    origin: 'Mendoza',
    destination: 'San Juan',
    createdDate: '2026-03-19',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-20',
    weight: 5.0,
    description: 'Paquete grande - rechazado en destino',
    routeId: '3',
    cancellationReason: 'Destinatario no disponible',
  },
  {
    id: '7',
    trackingId: 'LT-2024-007',
    sender: {
      name: 'Lucía Pereyra',
      address: 'San Lorenzo 350',
      city: 'Bahía Blanca',
      postalCode: '8000',
    },
    receiver: {
      name: 'Fernando Acosta',
      address: 'Mitre 600',
      city: 'Mar del Plata',
      postalCode: '7600',
    },
    status: 'Cancelado',
    origin: 'Bahía Blanca',
    destination: 'Mar del Plata',
    createdDate: '2026-03-20',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-23',
    weight: 1.5,
    description: 'Ropa y accesorios',
    routeId: '4',
    cancellationReason: 'Ruta cancelada por el transportista',
  },
  {
    id: '8',
    trackingId: 'LT-2024-008',
    sender: {
      name: 'Tomás Herrera',
      address: 'Independencia 900',
      city: 'Bahía Blanca',
      postalCode: '8000',
    },
    receiver: {
      name: 'Cecilia Molina',
      address: 'Italia 1500',
      city: 'Mar del Plata',
      postalCode: '7600',
    },
    status: 'Cancelado',
    origin: 'Bahía Blanca',
    destination: 'Mar del Plata',
    createdDate: '2026-03-20',
    lastUpdate: '2026-03-20',
    estimatedDelivery: '2026-03-23',
    weight: 3.7,
    description: 'Libros y materiales de estudio',
    routeId: '4',
    cancellationReason: 'Ruta cancelada por el transportista',

     },
  {
    id: '9',
    trackingId: 'LT-2024-009',
    sender: {
      name: 'Alicia Benítez',
      address: 'España 450',
      city: 'Santa Fe',
      postalCode: '3000',
    },
    receiver: {
      name: 'Ramiro Núñez',
      address: '9 de Julio 850',
      city: 'Paraná',
      postalCode: '3100',
    },
    status: 'Pendiente',
    origin: 'Santa Fe',
    destination: 'Paraná',
    createdDate: '2026-03-21',
    lastUpdate: '2026-03-21',
    estimatedDelivery: '2026-03-24',
    weight: 4.2,
    description: 'Insumos médicos',
  },
  {
    id: '10',
    trackingId: 'LT-2024-010',
    sender: {
      name: 'Gabriel Soto',
      address: 'Belgrano 75',
      city: 'Neuquén',
      postalCode: '8300',
    },
    receiver: {
      name: 'Julieta Paz',
      address: 'Brown 230',
      city: 'Cipolletti',
      postalCode: '8324',
    },
    status: 'Pendiente',
    origin: 'Neuquén',
    destination: 'Cipolletti',
    createdDate: '2026-03-21',
    lastUpdate: '2026-03-21',
    estimatedDelivery: '2026-03-25',
    weight: 2.9,
    description: 'Repuestos electrónicos'
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
      setTimeout(() => resolve([...mockShipments]), 500)
    })
  },

  // Obtener envío por ID
  getShipmentById: async (id: string): Promise<Shipment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.find((s) => s.id === id)), 300)
    })
  },

  // Obtener envíos por IDs de lista
  getShipmentsByIds: async (ids: string[]): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.filter((s) => ids.includes(s.id))), 300)
    })
  },

  // Obtener envíos por ruta
  getShipmentsByRouteId: async (routeId: string): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockShipments.filter((s) => s.routeId === routeId)), 300)
    })
  },
// Obtener envíos pendientes y sin ruta asignada
  getAssignableShipments: async (): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockShipments.filter(
              (s) => s.status === 'Pendiente' && (!s.routeId || s.routeId.trim() === ''),
            ),
          ),
        300,
      )
    })
  },

  // Asignar envíos a una ruta
  assignShipmentsToRoute: async (shipmentIds: string[], routeId: string): Promise<Shipment[]> => {
    return new Promise((resolve) => {
      const updated = mockShipments
        .filter((shipment) => shipmentIds.includes(shipment.id))
        .map((shipment) => {
          shipment.routeId = routeId
          shipment.lastUpdate = new Date().toISOString().split('T')[0]
          return { ...shipment }
        })

      setTimeout(() => resolve(updated), 400)
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

  // Buscar envío exacto por tracking ID (para escaneo)
  findByTrackingId: async (trackingId: string): Promise<Shipment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockShipments.find((s) => s.trackingId === trackingId)),
        300,
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

        if ((status === 'Cancelado' || status === 'Rechazado') && cancellationReason) {
          shipment.cancellationReason = cancellationReason
        } else if (status !== 'Cancelado' && status !== 'Rechazado') {
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
