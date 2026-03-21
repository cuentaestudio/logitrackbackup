import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
  TextField,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { shipmentService } from '../services/shipmentService'
import { Shipment } from '../types'

function ShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState<Shipment['status']>('En tránsito')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    loadShipment()
  }, [id])

  const loadShipment = async () => {
    if (!id) return

    setLoading(true)
    setError('')
    try {
      const data = await shipmentService.getShipmentById(id)
      if (data) {
        setShipment(data)
        setNewStatus(data.status)
      } else {
        setError('Envío no encontrado')
      }
    } catch (err) {
      setError('Error al cargar el envío')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!id || !shipment) return

    setUpdatingStatus(true)
    try {
      const updated = await shipmentService.updateShipmentStatus(id, newStatus)
      if (updated) {
        setShipment(updated)
        setOpenStatusDialog(false)
      }
    } catch (err) {
      setError('Error al actualizar el estado')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En tránsito':
        return 'info'
      case 'Entregado':
        return 'success'
      case 'Cancelado':
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

  if (!shipment) {
    return (
      <Box>
        <Alert severity="error">{error || 'Envío no encontrado'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver al dashboard
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="ID de Tracking"
                  value={shipment.trackingId}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Descripción"
                  value={shipment.description}
                  fullWidth
                  disabled
                />
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip label={shipment.status} color={getStatusColor(shipment.status) as any} />
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => setOpenStatusDialog(true)}
                  fullWidth
                >
                  Cambiar estado
                </Button>
                <TextField
                  label="Peso (kg)"
                  value={shipment.weight}
                  fullWidth
                  disabled
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fechas
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Fecha de creación"
                  value={shipment.createdDate}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Último actualización"
                  value={shipment.lastUpdate}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Entrega estimada"
                  value={shipment.estimatedDelivery}
                  fullWidth
                  disabled
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Remitente
              </Typography>
              <Stack spacing={1}>
                <TextField
                  label="Nombre"
                  value={shipment.sender.name}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Dirección"
                  value={shipment.sender.address}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Ciudad"
                  value={shipment.sender.city}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Código Postal"
                  value={shipment.sender.postalCode}
                  fullWidth
                  disabled
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Destinatario
              </Typography>
              <Stack spacing={1}>
                <TextField
                  label="Nombre"
                  value={shipment.receiver.name}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Dirección"
                  value={shipment.receiver.address}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Ciudad"
                  value={shipment.receiver.city}
                  fullWidth
                  disabled
                  size="small"
                />
                <TextField
                  label="Código Postal"
                  value={shipment.receiver.postalCode}
                  fullWidth
                  disabled
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ubicación
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Origen"
                  value={shipment.origin}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Destino"
                  value={shipment.destination}
                  fullWidth
                  disabled
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para cambiar estado */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Cambiar estado del envío</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Shipment['status'])}
            fullWidth
          >
            <MenuItem value="En tránsito">En tránsito</MenuItem>
            <MenuItem value="Entregado">Entregado</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={updatingStatus}
          >
            {updatingStatus ? <CircularProgress size={24} /> : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ShipmentDetail
