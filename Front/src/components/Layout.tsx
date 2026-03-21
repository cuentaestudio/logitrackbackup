import { Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import { User } from '../types'

interface LayoutProps {
  user: User
  onLogout: () => void
}

function Layout({ user, onLogout }: LayoutProps) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    onLogout()
    navigate('/login')
  }

  const initials = `${user.name.charAt(0)}${user.email.split('@')[0].charAt(0)}`.toUpperCase()

  const getRoleBadge = (role: string) => {
    const colors: Record<string, any> = {
      supervisor: 'error',
      operador: 'primary',
      transportista: 'success',
    }
    return colors[role] || 'default'
  }

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            📦 LogiTrack
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1 }}>
              <Typography variant="body2">{user.name}</Typography>
              {user.role && (
                <Chip
                  label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  size="small"
                  color={getRoleBadge(user.role)}
                  variant="outlined"
                  sx={{ height: 20 }}
                />
              )}
            </Box>
            <Avatar
              onClick={handleMenuOpen}
              sx={{ cursor: 'pointer', bgcolor: 'secondary.main' }}
            >
              {initials}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>{user.email}</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet context={user} />
      </Container>
    </Box>
  )
}

export default Layout
