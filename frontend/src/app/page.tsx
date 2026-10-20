'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box,
  Paper,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '../config/api';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/notifications/reminders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchReminders();
    }
    const handleRefresh = () => {
      if (user) fetchReminders();
    };
    window.addEventListener('lovesa:data-updated', handleRefresh);
    return () => window.removeEventListener('lovesa:data-updated', handleRefresh);
  }, [user, loading, router]);

  const toggleReminder = async (rem: any) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/reminders/${rem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isCompleted: !rem.isCompleted }),
      });
      fetchReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/reminders/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchReminders();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Hola, {user.name} 👋
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Bienvenido a tu organizador de relación con Dei. Háblale al botón mágico rosado (abajo a la derecha) para planear, crear o programar alertas.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea
              component={Link}
              href="/calendar"
              sx={{
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 68, color: 'text.primary', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary" align="center">
                Calendario de Actividades
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Organiza citas, aniversarios, y fechas importantes.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea
              component={Link}
              href="/ideas"
              sx={{
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <LightbulbIcon sx={{ fontSize: 68, color: 'text.primary', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary" align="center">
                Banco de Ideas
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Guarda planes futuros y metas a largo plazo.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', border: '1px solid rgba(233, 30, 99, 0.4)' }}>
            <CardActionArea
              component={Link}
              href="/gustos"
              sx={{
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <FavoriteIcon sx={{ fontSize: 68, color: '#e91e63', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary" align="center">
                Gustos de Dei 💖
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Sus canciones, comidas, flores, hobbies y lo que la enamora.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea
              component={Link}
              href="/experiencias"
              sx={{
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 68, color: 'text.primary', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary" align="center">
                Arquitectura de Experiencias
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Método Taraban: Planeador de Halloween, hitos e inbox.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Paper
        elevation={3}
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          border: '1px solid #333',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <NotificationsActiveIcon sx={{ color: '#e91e63' }} />
          <Typography variant="h6" fontWeight="bold">
            Recordatorios y Pendientes (Alertas Push al Teléfono)
          </Typography>
        </Box>

        {reminders.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tienes recordatorios pendientes. Pídele por voz al <strong>Director AI</strong> (botón abajo a la derecha):{' '}
            <em>&quot;Recuérdame mañana a las 5pm comprarle flores a Dei&quot;</em> y te llegará una notificación Push a tu teléfono.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {reminders.map((rem) => (
              <Box
                key={rem._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #333',
                  bgcolor: 'background.default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: rem.isCompleted ? 0.6 : 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton size="small" onClick={() => toggleReminder(rem)}>
                    {rem.isCompleted ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ textDecoration: rem.isCompleted ? 'line-through' : 'none' }}
                    >
                      {rem.title}
                    </Typography>
                    {rem.body && rem.body !== rem.title && (
                      <Typography variant="body2" color="text.secondary">
                        {rem.body}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        size="small"
                        label={new Date(rem.remindAt).toLocaleString('es-PA')}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        color={rem.sent ? 'success' : 'warning'}
                        label={rem.sent ? 'Notificado al teléfono' : 'Programado'}
                      />
                    </Box>
                  </Box>
                </Box>
                <IconButton size="small" color="error" onClick={() => deleteReminder(rem._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
