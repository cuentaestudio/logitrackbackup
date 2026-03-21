import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import type { Branch } from '../types'
import { branchService } from '../services/branchService'

interface BranchFormProps {
  open: boolean
  onClose: () => void
  onBranchCreated: (branch: Branch) => void
}

function BranchForm({ open, onClose, onBranchCreated }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre de la sucursal es requerido')
      return false
    }
    if (!formData.address.trim()) {
      setError('La dirección es requerida')
      return false
    }
    if (!formData.city.trim()) {
      setError('La ciudad es requerida')
      return false
    }
    if (!formData.postalCode.trim()) {
      setError('El código postal es requerido')
      return false
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // Verificar que la sucursal no exista
      const exists = await branchService.branchExists(formData.name)
      if (exists) {
        setError('Una sucursal con este nombre ya existe')
        setLoading(false)
        return
      }

      const newBranch = await branchService.createBranch(formData)
      onBranchCreated(newBranch)
      
      // Limpiar formulario
      setFormData({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
      })
      
      onClose()
    } catch (err) {
      setError('Error al crear la sucursal')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
      })
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Nueva Sucursal</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} padding={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Nombre de la sucursal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: Sucursal Centro"
            disabled={loading}
          />

          <TextField
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: Av. Corrientes 1000"
            disabled={loading}
          />

          <TextField
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: Buenos Aires"
            disabled={loading}
          />

          <TextField
            label="Código Postal"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: 1043"
            disabled={loading}
          />

          <TextField
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: +54 11 1234-5678"
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Guardando...' : 'Registrar Sucursal'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BranchForm
