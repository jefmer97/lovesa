'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Hola, {user.name} 👋
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Bienvenido a tu organizador de metas de relación. ¿Qué planearemos hoy?
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea component={Link} href="/calendar" sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <CalendarMonthIcon sx={{ fontSize: 80, color: 'text.primary', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">Calendario de Actividades</Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Organiza citas, aniversarios, y fechas importantes.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea component={Link} href="/ideas" sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <LightbulbIcon sx={{ fontSize: 80, color: 'text.primary', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">Banco de Ideas</Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Guarda planes futuros y metas a largo plazo.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea component={Link} href="/experiencias" sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', bgcolor: 'background.paper' }}>
              <AutoAwesomeIcon sx={{ fontSize: 80, color: 'text.primary', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">Arquitectura de Experiencias</Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Método Taraban: Planeador estratégico de citas, hitos e inbox de regalos.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
