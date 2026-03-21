export interface User {
  id: string
  name: string
  lastname: string
  email: string
  dni: string
}

export interface Shipment {
  id: string
  trackingId: string
  sender: {
    name: string
    address: string
    city: string
    postalCode: string
  }
  receiver: {
    name: string
    address: string
    city: string
    postalCode: string
  }
  status: 'En tránsito' | 'Entregado' | 'Cancelado'
  origin: string
  destination: string
  createdDate: string
  lastUpdate: string
  estimatedDelivery: string
  weight: number
  description: string
}

export interface LoginCredentials {
  dni: string
  password: string
}

export interface RegisterData {
  name: string
  lastname: string
  email: string
  dni: string
  password: string
  confirmPassword: string
}
