import { useState, useEffect } from 'react'
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
import type { User } from '../types'

interface TransportistsListProps {
  userRole?: string
}

function TransportistasList({ }: TransportistsListProps) {
  const [transportistas, setTransportistas] = useState<(User & { status?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransportistas()
  }, [])

  const loadTransportistas = async () => {
    setLoading(true)
    setError('')
    try {
      // Mock: obtener todos los usuarios y filtrar transportistas
      // En una app real, tendría un endpoint específico
      const allUsers = [
        {
          id: '3',
          name: 'Carlos',
          lastname: 'López',
          email: 'carlos@example.com',
          dni: '11223344',
          role: 'transportista' as const,
          status: 'Activo',
        },
        {
          id: '4',
          name: 'Juan',
          lastname: 'García',
          email: 'juan@example.com',
          dni: '22334455',
          role: 'transportista' as const,
          status: 'Activo',
        },
        {
          id: '5',
          name: 'María',
          lastname: 'Rodríguez',
          email: 'maria@example.com',
          dni: '33445566',
          role: 'transportista' as const,
          status: 'En viaje',
        },
        {
          id: '6',
          name: 'Pedro',
          lastname: 'Fernández',
          email: 'pedro@example.com',
          dni: '44556677',
          role: 'transportista' as const,
          status: 'Inactivo',
        },
      ]
      
      const filtered = allUsers.filter(u => u.role === 'transportista')
      setTransportistas(filtered)
    } catch (err) {
      setError('Error al cargar los transportistas')
    } finally {
      setLoading(false)
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
          <Typography variant="h6">
            Transportistas - Total: {transportistas.length}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {transportistas.length === 0 ? (
          <Alert severity="info">No hay transportistas registrados</Alert>
        ) : (
          <Grid container spacing={3}>
            {transportistas.map((transportista) => (
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
                      <Box sx={{ pt: 1 }}>
                        <Chip
                          label={transportista.status || 'Activo'}
                          color={
                            transportista.status === 'Activo' ? 'success' :
                            transportista.status === 'En viaje' ? 'warning' :
                            'default'
                          }
                          size="small"
                          variant="filled"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  )
}

export default TransportistasList
