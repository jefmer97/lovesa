'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, InputBase, Tooltip, Snackbar, Alert, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../theme/ThemeRegistry';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config/api';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#e91e63', 0.1),
  '&:hover': {
    backgroundColor: alpha('#e91e63', 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#c2185b',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    [theme.breakpoints.up('md')]: {
      width: '22ch',
    },
  },
}));

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [search, setSearch] = React.useState('');
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && user) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setPushEnabled(true);
        }
      }).catch((err) => console.error('SW reg error:', err));
    }
  }, [user]);

  const handleEnableOrTestPush = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setToast({
        open: true,
        message: 'En iPhone: toca Compartir -> "Agregar a pantalla de inicio" para recibir notificaciones Push.',
        severity: 'warning',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setToast({
          open: true,
          message: 'Debes permitir las notificaciones en tu navegador para recibir alertas en el teléfono.',
          severity: 'warning',
        });
        return;
      }

      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const keyRes = await fetch(`${API_URL}/notifications/vapid-public-key`);
      const { publicKey } = await keyRes.json();

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(sub),
      });

      setPushEnabled(true);
      setToast({
        open: true,
        message: '🔔 ¡Notificaciones Push activadas en este dispositivo! Revisa la alerta en tu teléfono.',
        severity: 'success',
      });
    } catch (err: any) {
      setToast({
        open: true,
        message: `Error al activar notificaciones: ${err.message}`,
        severity: 'error',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  if (!user) return null;

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: mode === 'dark' ? '1px solid #333' : '1px solid #e5e7eb',
        bgcolor: mode === 'dark' ? 'transparent' : '#ffffff',
        mb: 4,
      }}
    >
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FavoriteIcon sx={{ color: '#e91e63', mr: 1.5 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#e91e63' }}>
            lovesa
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar recuerdos o planes..."
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/" color="inherit" size="small">Dashboard</Button>
          <Button
            component={Link}
            href="/halloween"
            size="small"
            sx={{
              bgcolor: 'rgba(233, 30, 99, 0.15)',
              color: '#e91e63',
              fontWeight: 800,
              border: '1px solid rgba(233, 30, 99, 0.4)',
              '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.25)' },
            }}
          >
            🎃 Halloween
          </Button>
          <Button component={Link} href="/calendar" color="inherit" size="small">Calendario</Button>
          <Button component={Link} href="/timeline" color="inherit" size="small">Historia</Button>
          <Button component={Link} href="/ideas" color="inherit" size="small">Ideas</Button>
          <Button component={Link} href="/gustos" color="inherit" size="small" sx={{ color: '#e91e63', fontWeight: 700 }}>💖 Gustos de Dei</Button>
          <Button component={Link} href="/experiencias" color="inherit" size="small">Planeador</Button>
          <Tooltip title={pushEnabled ? 'Notificaciones activas (clic para enviar prueba al teléfono)' : 'Activar notificaciones Push en este teléfono'}>
            <Button
              onClick={handleEnableOrTestPush}
              variant={pushEnabled ? 'contained' : 'outlined'}
              color={pushEnabled ? 'success' : 'secondary'}
              size="small"
              startIcon={pushEnabled ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
            >
              {pushEnabled ? 'Push Activo' : 'Activar Push'}
            </Button>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                border: mode === 'dark' ? '1px solid #333' : '1px solid #e5e7eb',
                color: mode === 'dark' ? '#fbbf24' : '#374151',
                width: 36,
                height: 36,
              }}
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </Tooltip>
          <Button onClick={logout} variant="outlined" color="primary" size="small">Salir</Button>
        </Box>
      </Toolbar>
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
