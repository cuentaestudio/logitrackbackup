import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { shipmentService } from '../services/shipmentService'
import { vehicleService } from '../services/vehicleService'
import { branchService } from '../services/branchService'
import { Shipment, User, Vehicle, Branch } from '../types'
import ShipmentCard from '../components/ShipmentCard'
import ShipmentForm from '../components/ShipmentForm'
import VehicleForm from '../components/VehicleForm'
import BranchForm from '../components/BranchForm'
import RoutesList from '../components/RoutesList'
import TransportistasList from '../components/TransportistasList'
import SearchBar from '../components/SearchBar'

function Dashboard() {
  const user = useOutletContext<User>()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [openShipmentForm, setOpenShipmentForm] = useState(false)
  const [openVehicleForm, setOpenVehicleForm] = useState(false)
  const [openBranchForm, setOpenBranchForm] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [tab, setTab] = useState(0)

  // Retornar si no hay usuario (evitar errores)
  if (!user) {
    return <CircularProgress />
  }

  // Cargar envíos al montar el componente
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [shipmentsData, vehiclesData, branchesData] = await Promise.all([
        shipmentService.getAllShipments(),
        user.role === 'operador' ? vehicleService.getVehiclesByOperator(user.id) : vehicleService.getAllVehicles(),
        branchService.getAllBranches(),
      ])
      setShipments(shipmentsData)
      setFilteredShipments(shipmentsData)
      setVehicles(vehiclesData)
      setBranches(branchesData)
    } catch (err) {
      setError('Error al cargar los datos')
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
      setOpenShipmentForm(false)
    } catch (err) {
      setError('Error al crear el envío')
    }
  }

  const handleCreateVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const newVehicle = await vehicleService.createVehicle(vehicle)
      setVehicles((prev) => [newVehicle, ...prev])
      setOpenVehicleForm(false)
    } catch (err) {
      setError('Error al crear el vehículo')
    }
  }

  const handleCreateBranch = (branch: Branch) => {
    setBranches((prev) => [branch, ...prev])
    setOpenBranchForm(false)
  }

  // Descargar envíos como CSV
  const handleDownloadShipments = () => {
    if (shipments.length === 0) {
      alert('No hay envíos para descargar')
      return
    }

    // Preparar datos para CSV
    const headers = ['ID', 'Tracking ID', 'Estado', 'Origen', 'Destino', 'Remitente', 'Destinatario', 'Peso (kg)', 'Descripción', 'Fecha Creación', 'Fecha Entrega Estimada']
    const rows = shipments.map(s => [
      s.id,
      s.trackingId,
      s.status,
      s.origin,
      s.destination,
      s.sender.name,
      s.receiver.name,
      s.weight,
      s.description,
      s.createdDate,
      s.estimatedDelivery,
    ])

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    // Descargar archivo
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
    element.setAttribute('download', `envios_${new Date().toISOString().split('T')[0]}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard - {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Usuario'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Bienvenido, {user?.name || 'Usuario'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* SUPERVISOR */}
      {user.role === 'supervisor' && (
        <Box>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label={`Envíos ${filteredShipments.length > 0 ? `(${filteredShipments.length})` : ''}`} />
            <Tab label={`Sucursales ${branches.length > 0 ? `(${branches.length})` : ''}`} />
            <Tab label="Rutas" />
          </Tabs>

          {/* TAB ENVIOS */}
          {tab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Envíos</Typography>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadShipments}
                  size="small"
                >
                  Descargar CSV
                </Button>
              </Box>
              <SearchBar onSearch={handleSearch} loading={searchLoading} />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredShipments.length === 0 ? (
            <Alert severity="info">
              {hasSearched ? 'No se encontraron envíos' : 'No hay envíos disponibles'}
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
            </Box>
          )}

          {/* TAB SUCURSALES */}
          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Sucursales Registradas</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenBranchForm(true)}
                >
                  Registrar sucursal
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : branches.length === 0 ? (
                <Alert severity="info">No hay sucursales registradas</Alert>
              ) : (
                <Grid container spacing={3}>
                  {branches.map((branch) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={branch.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {branch.name}
                          </Typography>
                          <Stack spacing={1}>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Dirección
                              </Typography>
                              <Typography variant="body2">{branch.address}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Ciudad
                              </Typography>
                              <Typography variant="body2">{branch.city}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Código Postal
                              </Typography>
                              <Typography variant="body2">{branch.postalCode}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Teléfono
                              </Typography>
                              <Typography variant="body2">{branch.phone}</Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* TAB RUTAS */}
          {tab === 2 && <RoutesList userRole="supervisor" />}
        </Box>
      )}

      {/* OPERADOR */}
      {user.role === 'operador' && (
        <Box>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label={`Envíos ${filteredShipments.length > 0 ? `(${filteredShipments.length})` : ''}`} />
            <Tab label={`Vehículos ${vehicles.length > 0 ? `(${vehicles.length})` : ''}`} />
            <Tab label={`Sucursales ${branches.length > 0 ? `(${branches.length})` : ''}`} />
            <Tab label="Transportistas" />
            <Tab label="Rutas" />
          </Tabs>

          {/* TAB ENVIOS */}
          {tab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Nuevos Envíos</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleDownloadShipments}
                    size="small"
                  >
                    Descargar CSV
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenShipmentForm(true)}
                  >
                    Registrar envío
                  </Button>
                </Box>
              </Box>
              <SearchBar onSearch={handleSearch} loading={searchLoading} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : filteredShipments.length === 0 ? (
                <Alert severity="info">
                  {hasSearched ? 'No se encontraron envíos' : 'No hay envíos disponibles'}
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
            </Box>
          )}

          {/* TAB VEHICULOS */}
          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Mis Vehículos</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenVehicleForm(true)}
                >
                  Registrar vehículo
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : vehicles.length === 0 ? (
                <Alert severity="info">No tienes vehículos registrados</Alert>
              ) : (
                <Grid container spacing={3}>
                  {vehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                      <Box
                        sx={{
                          p: 2,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Typography variant="h6">{vehicle.patente}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {vehicle.marca}
                        </Typography>
                        <Typography variant="body2">
                          Capacidad: {vehicle.capacidadCarga} kg
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            p: 0.5,
                            borderRadius: 0.5,
                            bgcolor: vehicle.estado === 'Disponible' ? '#4caf50' : '#ffc107',
                            color: 'white',
                            textAlign: 'center',
                          }}
                        >
                          {vehicle.estado}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* TAB SUCURSALES */}
          {tab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Sucursales Registradas</Typography>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : branches.length === 0 ? (
                <Alert severity="info">No hay sucursales registradas</Alert>
              ) : (
                <Grid container spacing={3}>
                  {branches.map((branch) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={branch.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {branch.name}
                          </Typography>
                          <Stack spacing={1}>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Dirección
                              </Typography>
                              <Typography variant="body2">{branch.address}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Ciudad
                              </Typography>
                              <Typography variant="body2">{branch.city}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Código Postal
                              </Typography>
                              <Typography variant="body2">{branch.postalCode}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Teléfono
                              </Typography>
                              <Typography variant="body2">{branch.phone}</Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* TAB TRANSPORTISTAS */}
          {tab === 3 && <TransportistasList userRole="operador" />}

          {/* TAB RUTAS */}
          {tab === 4 && <RoutesList userRole="operador" />}
        </Box>
      )}

      {/* TRANSPORTISTA */}
      {user.role === 'transportista' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Mis Rutas</Typography>
          </Box>
          <Alert severity="info">
            Funcionalidad de rutas en desarrollo...
          </Alert>
        </Box>
      )}

      <ShipmentForm
        open={openShipmentForm}
        onClose={() => setOpenShipmentForm(false)}
        onSubmit={handleCreateShipment}
      />
      <VehicleForm
        open={openVehicleForm}
        onClose={() => setOpenVehicleForm(false)}
        onSubmit={handleCreateVehicle}
        operatorId={user.id}
      />
      <BranchForm
        open={openBranchForm}
        onClose={() => setOpenBranchForm(false)}
        onBranchCreated={handleCreateBranch}
      />
    </Box>
  )
}

export default Dashboard
