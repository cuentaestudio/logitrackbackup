import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  TextField,
  Rating,
  Avatar,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import InventoryIcon from '@mui/icons-material/Inventory'
import RouteIcon from '@mui/icons-material/Route'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type { SelectChangeEvent } from '@mui/material'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string
  name: string
  role: string
  category: 'entrega' | 'vehiculo' | 'general'
  rating: number
  comment: string
  date: string
  avatar: string
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', name: 'Martina González', role: 'Empresaria', category: 'entrega', rating: 5, comment: 'Excelente tiempo de entrega. Mi pedido llegó antes de lo esperado y en perfectas condiciones. El sistema de seguimiento en tiempo real es increíble.', date: '15/03/2026', avatar: 'MG' },
  { id: '2', name: 'Roberto Sánchez', role: 'Comerciante', category: 'vehiculo', rating: 4, comment: 'La flota de vehículos está muy bien mantenida. Los transportistas son profesionales y cuidan mucho los paquetes.', date: '10/03/2026', avatar: 'RS' },
  { id: '3', name: 'Ana Rodríguez', role: 'Diseñadora', category: 'general', rating: 5, comment: 'La plataforma es muy fácil de usar. Pude rastrear mi envío en todo momento y el soporte al cliente fue excelente.', date: '08/03/2026', avatar: 'AR' },
  { id: '4', name: 'Diego Martínez', role: 'Importador', category: 'entrega', rating: 4, comment: 'Muy buen servicio. Los tiempos de entrega son precisos y el sistema de rutas optimizado me ha ahorrado mucho dinero.', date: '05/03/2026', avatar: 'DM' },
  { id: '5', name: 'Sofía Herrera', role: 'Emprendedora', category: 'vehiculo', rating: 5, comment: 'Los vehículos llegan siempre impecables y los conductores son muy amables. Se nota que hay un control de calidad riguroso.', date: '01/03/2026', avatar: 'SH' },
  { id: '6', name: 'Luciano Pérez', role: 'Mayorista', category: 'general', rating: 5, comment: 'Llevo 2 años usando LogiTrack y no volvería a otra empresa. La transparencia, el seguimiento y la atención son incomparables.', date: '25/02/2026', avatar: 'LP' },
  { id: '7', name: 'Valentina Torres', role: 'Arquitecta', category: 'entrega', rating: 4, comment: 'Muy satisfecha con el servicio. Las estimaciones de entrega son muy precisas y el personal es cordial.', date: '20/02/2026', avatar: 'VT' },
  { id: '8', name: 'Matías Romero', role: 'Fabricante', category: 'vehiculo', rating: 5, comment: 'La calidad de los vehículos refrigerados es excepcional. Perfectos para mis envíos de productos perecederos.', date: '15/02/2026', avatar: 'MR' },
]

const AVATAR_COLORS = ['#0288D1', '#00897B', '#7B1FA2', '#C62828', '#F57C00', '#2E7D32', '#1565C0', '#AD1457']
function avatarColor(s: string) {
  let h = 0; for (const c of s) h += c.charCodeAt(0)
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const categoryLabel: Record<Review['category'], string> = { entrega: 'Tiempo de entrega', vehiculo: 'Vehículo', general: 'General' }
const categoryColor: Record<Review['category'], string> = { entrega: '#0288D1', vehiculo: '#00897B', general: '#7B1FA2' }

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let cur = 0
        const inc = target / 60
        const t = setInterval(() => {
          cur += inc
          if (cur >= target) { setCount(target); clearInterval(t) }
          else setCount(Math.floor(cur))
        }, 2000 / 60)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setV(true), delay) }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])
  return { ref, visible: v }
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [page, setPage] = useState(0)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [nr, setNr] = useState({ name: '', role: '', category: 'general' as Review['category'], rating: 5, comment: '' })
  const [submitted, setSubmitted] = useState(false)
  const [nrError, setNrError] = useState('')

  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const howRef = useRef<HTMLElement>(null)
  const reviewsRef = useRef<HTMLElement>(null)
  const loginRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 400) }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const totalPages = Math.ceil(reviews.length / 3)
  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000)
    return () => clearInterval(t)
  }, [totalPages])

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false)
  }

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) { setLoginError('Completá todos los campos'); return }
    const accounts: Record<string, { password: string; role: 'supervisor' | 'operador' | 'transportista' }> = {
      'supervisor@logitrack.com': { password: '123456', role: 'supervisor' },
      'operador@logitrack.com': { password: '123456', role: 'operador' },
      'transportista@logitrack.com': { password: '123456', role: 'transportista' },
    }
    const acc = accounts[loginData.email.toLowerCase()]
    if (!acc || acc.password !== loginData.password) { setLoginError('Email o contraseña incorrectos'); return }
    const user = { id: '1', name: 'Usuario Demo', lastname: '', email: loginData.email, dni: '00000000', role: acc.role }
    localStorage.setItem('user', JSON.stringify(user))
    navigate(acc.role === 'transportista' ? '/transportista' : '/')
  }

  const handleSubmitReview = () => {
    if (!nr.name.trim()) { setNrError('Ingresá tu nombre'); return }
    if (!nr.comment.trim()) { setNrError('Ingresá un comentario'); return }
    const initials = nr.name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    setReviews((prev) => [{ id: Date.now().toString(), name: nr.name.trim(), role: nr.role.trim() || 'Usuario', category: nr.category, rating: nr.rating, comment: nr.comment.trim(), date: new Date().toLocaleDateString('es-AR'), avatar: initials }, ...prev])
    setNr({ name: '', role: '', category: 'general', rating: 5, comment: '' })
    setSubmitted(true); setNrError(''); setPage(0)
  }

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0
  const visible = reviews.slice(page * 3, page * 3 + 3)

  const statsR = useReveal()
  const aboutR = useReveal(80)
  const howR = useReveal()
  const featR = useReveal(80)
  const revR = useReveal()
  const loginR = useReveal()

  const navItems = [
    { label: 'Inicio', ref: heroRef },
    { label: 'Nosotros', ref: aboutRef },
    { label: 'Cómo funciona', ref: howRef },
    { label: 'Reseñas', ref: reviewsRef },
  ]

  return (
    <Box sx={{ overflowX: 'hidden', bgcolor: '#F0F8FF' }}>

      {/* ── NAVBAR ── */}
      <Box component="nav" sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300,
        transition: 'all 0.3s ease',
        bgcolor: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(2,136,209,0.12)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(2,136,209,0.08)' : 'none',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }} onClick={() => scrollTo(heroRef)}>
              <Box sx={{ width: 40, height: 40, borderRadius: '11px', background: 'linear-gradient(135deg,#0288D1,#29B6F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(2,136,209,0.4)' }}>
                <LocalShippingIcon sx={{ color: '#fff', fontSize: 21 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px', background: scrolled ? 'linear-gradient(135deg,#0277BD,#0288D1)' : 'linear-gradient(135deg,#fff,#B3E5FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LogiTrack
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {navItems.map((item) => (
                <Button key={item.label} onClick={() => scrollTo(item.ref)} sx={{ color: scrolled ? '#37474F' : 'rgba(255,255,255,0.88)', fontWeight: 600, fontSize: '0.875rem', px: 1.5, '&:hover': { color: scrolled ? '#0288D1' : '#fff', bgcolor: 'transparent' }, transition: 'color 0.2s' }}>
                  {item.label}
                </Button>
              ))}
              <Button variant="contained" onClick={() => scrollTo(loginRef)} sx={{ ml: 1.5, background: 'linear-gradient(135deg,#0288D1,#0277BD)', borderRadius: '22px', px: 2.5, fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 3px 12px rgba(2,136,209,0.4)', '&:hover': { background: 'linear-gradient(135deg,#0277BD,#01579B)', transform: 'translateY(-1px)', boxShadow: '0 5px 18px rgba(2,136,209,0.5)' }, transition: 'all 0.25s ease' }}>
                Iniciar sesión
              </Button>
            </Box>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: scrolled ? '#37474F' : '#fff' }} onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Container>
        {menuOpen && (
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', bgcolor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(2,136,209,0.1)', px: 2, pb: 2 }}>
            {[...navItems, { label: 'Iniciar sesión', ref: loginRef }].map((item) => (
              <Button key={item.label} fullWidth onClick={() => scrollTo(item.ref)} sx={{ justifyContent: 'flex-start', py: 1, color: '#37474F', fontWeight: 600 }}>{item.label}</Button>
            ))}
          </Box>
        )}
      </Box>

      {/* ── HERO ── */}
      <Box component="section" ref={heroRef} sx={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#012849 0%,#01579B 40%,#0288D1 70%,#29B6F6 100%)' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: "url('/warehouse.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        {[{ s: 500, t: '-15%', l: '-10%', d: 18, dl: 0 }, { s: 350, t: '55%', r: '-8%', d: 14, dl: 3 }, { s: 250, t: '20%', r: '18%', d: 10, dl: 6 }].map((b, i) => (
          <Box key={i} sx={{ position: 'absolute', borderRadius: '50%', width: b.s, height: b.s, top: b.t, left: (b as { l?: string }).l, right: (b as { r?: string }).r, background: 'rgba(255,255,255,0.04)', animation: `blob ${b.d}s ease-in-out ${b.dl}s infinite`, '@keyframes blob': { '0%,100%': { transform: 'scale(1) translate(0,0)' }, '33%': { transform: 'scale(1.08) translate(15px,-20px)' }, '66%': { transform: 'scale(0.95) translate(-10px,15px)' } }, zIndex: 0 }} />
        ))}
        <Box sx={{ position: 'absolute', bottom: '10%', zIndex: 1, animation: 'truck 16s linear infinite', '@keyframes truck': { '0%': { left: '-80px', opacity: 0 }, '5%': { opacity: 0.07 }, '95%': { opacity: 0.07 }, '100%': { left: '105%', opacity: 0 } } }}>
          <LocalShippingIcon sx={{ fontSize: 110, color: '#fff' }} />
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: { xs: 12, md: 10 }, pb: 8 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '24px', px: 2, py: 0.75, mb: 3, animation: 'hf 0.7s ease forwards', opacity: 0, '@keyframes hf': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                <CheckCircleIcon sx={{ fontSize: 13, color: '#80DEEA' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontWeight: 700, fontSize: '0.75rem' }}>Sistema de logística líder en Argentina</Typography>
              </Box>
              <Typography variant="h1" sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' }, lineHeight: 1.08, mb: 2.5, textShadow: '0 2px 24px rgba(0,0,0,0.28)', animation: 'hf 0.7s ease 0.15s forwards', opacity: 0 }}>
                Logística{' '}
                <Box component="span" sx={{ background: 'linear-gradient(90deg,#4FC3F7,#80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>inteligente</Box>
                {' '}para tu empresa
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.75, mb: 4, maxWidth: 500, animation: 'hf 0.7s ease 0.3s forwards', opacity: 0 }}>
                Gestioná envíos, rutas y flotas en tiempo real. Transparencia total, entregas a tiempo y control absoluto desde una sola plataforma.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', animation: 'hf 0.7s ease 0.45s forwards', opacity: 0 }}>
                <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => scrollTo(loginRef)} sx={{ bgcolor: '#fff', color: '#0277BD', fontWeight: 800, fontSize: '1rem', px: 3.5, py: 1.5, borderRadius: '14px', boxShadow: '0 4px 20px rgba(255,255,255,0.25)', '&:hover': { bgcolor: '#E1F5FE', transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(255,255,255,0.35)' }, transition: 'all 0.25s ease' }}>
                  Comenzar ahora
                </Button>
                <Button variant="outlined" size="large" onClick={() => scrollTo(howRef)} sx={{ borderColor: 'rgba(255,255,255,0.45)', color: '#fff', fontWeight: 700, fontSize: '1rem', px: 3.5, py: 1.5, borderRadius: '14px', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)' }, transition: 'all 0.25s ease' }}>
                  Ver cómo funciona
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4, animation: 'hf 0.7s ease 0.6s forwards', opacity: 0 }}>
                <Box sx={{ display: 'flex' }}>
                  {['MG', 'RS', 'AR', 'DM'].map((init, i) => (
                    <Avatar key={init} sx={{ width: 32, height: 32, fontSize: '0.65rem', fontWeight: 700, bgcolor: avatarColor(init), ml: i > 0 ? '-8px' : 0, border: '2px solid rgba(255,255,255,0.3)' }}>{init}</Avatar>
                  ))}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex' }}>{[1,2,3,4,5].map((s) => <Box key={s} component="span" sx={{ color: '#FFD54F', fontSize: '0.9rem' }}>★</Box>)}</Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600 }}>+2,400 clientes satisfechos</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: 440 }}>
                <Card sx={{ position: 'absolute', top: 0, left: 30, right: 0, bgcolor: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '22px', p: 2.5, boxShadow: '0 12px 40px rgba(0,0,0,0.22)', animation: 'fcard 7s ease-in-out infinite', '@keyframes fcard': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(79,195,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LocalShippingIcon sx={{ color: '#4FC3F7', fontSize: 24 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Envío en tránsito</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>TRK-2026-001847</Typography>
                    </Box>
                    <Chip label="En ruta" size="small" sx={{ bgcolor: 'rgba(79,195,247,0.18)', color: '#4FC3F7', fontWeight: 700, fontSize: '0.68rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                    {['Recibido', 'Procesado', 'En ruta', 'Entregado'].map((step, i) => (
                      <Box key={step} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flex: 1 }}>
                        <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: i < 3 ? '#4FC3F7' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {i < 3 && <CheckCircleIcon sx={{ fontSize: 16, color: '#012849' }} />}
                        </Box>
                        <Typography sx={{ color: i < 3 ? '#4FC3F7' : 'rgba(255,255,255,0.35)', fontSize: '0.6rem', fontWeight: 600, textAlign: 'center' }}>{step}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
                <Card sx={{ position: 'absolute', bottom: 80, left: 0, width: 155, p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fcard 8s ease-in-out 1s infinite' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#546E7A', fontWeight: 600, mb: 0.5 }}>Entregas hoy</Typography>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#0288D1', lineHeight: 1 }}>98<Box component="span" sx={{ fontSize: '1rem' }}>%</Box></Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#4CAF50', fontWeight: 600 }}>↑ +3% vs ayer</Typography>
                </Card>
                <Card sx={{ position: 'absolute', bottom: 80, right: 10, width: 155, p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fcard 6s ease-in-out 2s infinite' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#546E7A', fontWeight: 600, mb: 0.5 }}>Rutas activas</Typography>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#0288D1', lineHeight: 1 }}>24</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#546E7A', fontWeight: 600 }}>en tiempo real</Typography>
                </Card>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 6, md: 4 }, animation: 'hf 0.7s ease 0.8s forwards', opacity: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => scrollTo(aboutRef)}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Scroll</Typography>
              <Box sx={{ width: 1.5, height: 40, bgcolor: 'rgba(255,255,255,0.25)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '2px', animation: 'scrollDot 2s ease-in-out infinite', '@keyframes scrollDot': { '0%': { top: 0 }, '100%': { top: '60%' } } }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── STATS ── */}
      <Box ref={statsR.ref} sx={{ py: 6, background: 'linear-gradient(135deg,#0277BD 0%,#0288D1 50%,#029BE5 100%)', opacity: statsR.visible ? 1 : 0, transform: statsR.visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[
              {
