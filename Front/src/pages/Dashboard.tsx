import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { shipmentService } from '../services/shipmentService'
import { Shipment } from '../types'
import ShipmentCard from '../components/ShipmentCard'
import ShipmentForm from '../components/ShipmentForm'
import SearchBar from '../components/SearchBar'

function Dashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Cargar envíos al montar el componente
  useEffect(() => {
    loadShipments()
  }, [])

  const loadShipments = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await shipmentService.getAllShipments()
      setShipments(data)
      setFilteredShipments(data)
      setHasSearched(false)
    } catch (err) {
      setError('Error al cargar los envíos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchLoading(true)
    setError('')
    try {
      if (!query.trim()) {
        setFilteredShipments(shipments)
        setHasSearched(false)
      } else {
        const results = await shipmentService.searchByTrackingId(query)
        setFilteredShipments(results)
        setHasSearched(true)
      }
    } catch (err) {
      setError('Error al buscar envíos')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCreateShipment = async (shipment: Omit<Shipment, 'id' | 'lastUpdate'>) => {
    try {
      const newShipment = await shipmentService.createShipment(shipment)
      setShipments((prev) => [newShipment, ...prev])
      setFilteredShipments((prev) => [newShipment, ...prev])
    } catch (err) {
      setError('Error al crear el envío')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Envíos
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filteredShipments.length} envío(s) encontrado(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ mt: 1 }}
        >
          Nuevo envío
        </Button>
      </Box>

      <SearchBar onSearch={handleSearch} loading={searchLoading} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredShipments.length === 0 ? (
        <Alert severity="info">
          {hasSearched ? 'No se encontraron envíos con ese ID de tracking' : 'No hay envíos disponibles'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredShipments.map((shipment) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={shipment.id}>
              <ShipmentCard shipment={shipment} />
            </Grid>
          ))}
        </Grid>
      )}

      <ShipmentForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleCreateShipment} />
    </Box>
  )
}

export default Dashboard
