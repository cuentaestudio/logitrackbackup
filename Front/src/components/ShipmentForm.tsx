import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material'
import { Shipment } from '../types'

interface ShipmentFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (shipment: Omit<Shipment, 'id' | 'lastUpdate'>) => Promise<void>
}

function ShipmentForm({ open, onClose, onSubmit }: ShipmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    trackingId: '',
    senderName: '',
    senderAddress: '',
    senderCity: '',
    senderPostal: '',
    receiverName: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPostal: '',
    origin: '',
    destination: '',
    weight: '',
    description: '',
    estimatedDelivery: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.trackingId) newErrors.trackingId = 'Requerido'
    if (!formData.senderName) newErrors.senderName = 'Requerido'
    if (!formData.receiverName) newErrors.receiverName = 'Requerido'
    if (!formData.origin) newErrors.origin = 'Requerido'
    if (!formData.destination) newErrors.destination = 'Requerido'
    if (!formData.weight || isNaN(Number(formData.weight))) newErrors.weight = 'Debe ser un número'
    if (!formData.description) newErrors.description = 'Requerido'
    if (!formData.estimatedDelivery) newErrors.estimatedDelivery = 'Requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit({
        trackingId: formData.trackingId,
        sender: {
          name: formData.senderName,
          address: formData.senderAddress,
          city: formData.senderCity,
          postalCode: formData.senderPostal,
        },
        receiver: {
          name: formData.receiverName,
          address: formData.receiverAddress,
          city: formData.receiverCity,
          postalCode: formData.receiverPostal,
        },
        origin: formData.origin,
        destination: formData.destination,
        weight: Number(formData.weight),
        description: formData.description,
        estimatedDelivery: formData.estimatedDelivery,
        status: 'En tránsito',
        createdDate: new Date().toISOString().split('T')[0],
      })

      // Limpiar formulario
      setFormData({
        trackingId: '',
        senderName: '',
        senderAddress: '',
        senderCity: '',
        senderPostal: '',
        receiverName: '',
        receiverAddress: '',
        receiverCity: '',
        receiverPostal: '',
        origin: '',
        destination: '',
        weight: '',
        description: '',
        estimatedDelivery: '',
      })
      onClose()
    } catch (error) {
      console.error('Error al crear envío:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar nuevo envío</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ID de Tracking"
            name="trackingId"
            value={formData.trackingId}
            onChange={handleChange}
            error={!!errors.trackingId}
            helperText={errors.trackingId}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Remitente
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  error={!!errors.senderName}
                  helperText={errors.senderName}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dirección"
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Ciudad"
                  name="senderCity"
                  value={formData.senderCity}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CP"
                  name="senderPostal"
                  value={formData.senderPostal}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Destinatario
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  error={!!errors.receiverName}
                  helperText={errors.receiverName}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dirección"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Ciudad"
                  name="receiverCity"
                  value={formData.receiverCity}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CP"
                  name="receiverPostal"
                  value={formData.receiverPostal}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Origen"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                error={!!errors.origin}
                helperText={errors.origin}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Destino"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                error={!!errors.destination}
                helperText={errors.destination}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            label="Peso (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            error={!!errors.weight}
            helperText={errors.weight}
            fullWidth
            inputProps={{ step: '0.1' }}
          />

          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Fecha estimada de entrega"
            name="estimatedDelivery"
            type="date"
            value={formData.estimatedDelivery}
            onChange={handleChange}
            error={!!errors.estimatedDelivery}
            helperText={errors.estimatedDelivery}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Registrar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShipmentForm
