import { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material'
import type { Route } from '../types'
import { routeService } from '../services/routeService'

interface RoutesListProps {
  userRole?: string
}

function RoutesList({ }: RoutesListProps) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<Route['status'] | 'Todas'>('Todas')

  useEffect(() => {
    loadRoutes()
  }, [])

  const loadRoutes = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await routeService.getAllRoutes()
      setRoutes(data)
      setFilteredRoutes(data)
    } catch (err) {
      setError('Error al cargar las rutas')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (status: Route['status'] | 'Todas') => {
    setSelectedStatus(status)
    if (status === 'Todas') {
      setFilteredRoutes(routes)
    } else {
      const filtered = await routeService.getRoutesByStatus(status)
      setFilteredRoutes(filtered)
    }
  }

  const getStatusColor = (status: Route['status']) => {
    switch (status) {
      case 'Creada':
        return 'info'
      case 'En Curso':
        return 'warning'
      case 'Finalizada':
        return 'success'
      case 'Cancelada':
        return 'error'
      default:
        return 'default'
    }
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
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Rutas - Total: {filteredRoutes.length} / {routes.length}</Typography>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={selectedStatus}
              label="Filtrar por estado"
              onChange={(e) => handleStatusChange(e.target.value as Route['status'] | 'Todas')}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="Creada">Creada</MenuItem>
              <MenuItem value="En Curso">En Curso</MenuItem>
              <MenuItem value="Finalizada">Finalizada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {filteredRoutes.length === 0 ? (
          <Alert severity="info">
            {routes.length === 0 ? 'No hay rutas registradas' : 'No hay rutas con este estado'}
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID Viaje</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Transportista</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vehículo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Origen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Envíos
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Creación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow key={route.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{route.routeId}</TableCell>
                    <TableCell>Transportista {route.transportistId}</TableCell>
                    <TableCell>Vehículo {route.vehicleId}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={route.shipmentIds.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={route.status}
                        size="small"
                        color={getStatusColor(route.status) as any}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem' }}>{route.createdDate}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Box>
  )
}

export default RoutesList
