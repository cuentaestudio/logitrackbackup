import { useState, useEffect ,useMemo} from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Grid,
} from '@mui/material'

import type { User, Route } from '../types'
import { authService } from '../services/authService'
import { routeService } from '../services/routeService'

interface TransportistsListProps {
  userRole?: string
}

function TransportistasList({ }: TransportistsListProps) {
  const [transportistas, setTransportistas] = useState<User[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransportistas()
  }, [])

  const routesByTransportista = useMemo(() => {
    return routes.reduce<Record<string, Route[]>>((acc, route) => {
      acc[route.transportistId] = [...(acc[route.transportistId] ?? []), route]
      return acc
    }, {})
  }, [routes])


  const loadTransportistas = async () => {
    setLoading(true)
    setError('')
    try {
        const [transportistasData, routesData] = await Promise.all([
        authService.getTransportistas(),
        routeService.getAllRoutes(),
      ])
      setTransportistas(transportistasData)
      setRoutes(routesData)
    } catch (err) {
      setError('Error al cargar los transportistas')
    } finally {
      setLoading(false)
    }
  }

    const getStatus = (transportistaId: string) => {
    const assignedRoutes = routesByTransportista[transportistaId] ?? []
    if (assignedRoutes.some((route) => route.status === 'En Curso')) {
      return { label: 'En viaje', color: 'warning' as const }
    }
    if (assignedRoutes.some((route) => route.status === 'Creada')) {
      return { label: 'Con ruta asignada', color: 'info' as const }
    }
    if (assignedRoutes.length > 0) {
      return { label: 'Disponible', color: 'success' as const }
    }
    return { label: 'Sin asignación', color: 'default' as const }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Transportistas - Total: {transportistas.length}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {transportistas.length === 0 ? (
          <Alert severity="info">No hay transportistas registrados</Alert>
        ) : (
          <Grid container spacing={3}>
            {transportistas.map((transportista) => {
              const status = getStatus(transportista.id)
              const assignedRoutes = routesByTransportista[transportista.id] ?? []

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={transportista.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {transportista.name} {transportista.lastname}
                      </Typography>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body2">{transportista.email}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            DNI
                          </Typography>
                          <Typography variant="body2">{transportista.dni}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Rutas asignadas
                          </Typography>
                          <Typography variant="body2">{assignedRoutes.length}</Typography>
                        </Box>
                        <Box sx={{ pt: 1 }}>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            variant="filled"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default TransportistasList
