'use client';
import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Card, CardContent, Grid, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CoffeeIcon from '@mui/icons-material/Coffee';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ExperienciasPlanner() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const anual = [
    { mes: 'Agosto 2026', evento: 'Inicio del Planeador (Mr. Bono y El Dorado)', icono: '✅' },
    { mes: 'Septiembre 2026', evento: 'Aniversario: Regalar Flores (15/09)', icono: '💐' },
    { mes: 'Septiembre 2026', evento: 'Día de las Flores Amarillas (21/09)', icono: '🌻' },
    { mes: 'Septiembre 2026', evento: 'Cenar en Casco Antiguo y Hotel Boutique', icono: '🍷' },
    { mes: 'Octubre 2026', evento: 'Celebrar Halloween Juntos Disfrazados (31/10)', icono: '🎃' },
    { mes: 'Noviembre 2026', evento: 'Cenar en Casco Antiguo y Hotel Boutique', icono: '🍷' },
    { mes: 'Diciembre 2026', evento: 'Regalo de Flores (15/12 - Trimestral)', icono: '💐' },
    { mes: 'Diciembre 2026', evento: 'Plan de Navidad - "La Navidad Más Linda"', icono: '🎄' },
    { mes: 'Enero 2027', evento: 'Tirarse de un Avión en Paracaídas (29/01)', icono: '🪂' },
    { mes: 'Enero 2027', evento: 'Cenar en Casco Antiguo y Hotel Boutique', icono: '🍷' },
    { mes: 'Marzo 2027', evento: 'Regalo de Flores (15/03 - Trimestral)', icono: '💐' }
  ];

  const inboxElla = [
    "Tour de avistamiento de ballenas",
    "Plan Artístico de Moldeado de Arcilla",
    "Desayuno en restaurante Koreano y tomar té",
    "Día de Playa",
    "Día de Casa: Tú le cocinas, ella disfruta",
    "Salir a Bailar Música Latina",
    "Ir a la Iglesia juntos",
    "Enseñanza de Skateboard"
  ];

  const inboxJeff = [
    "Tour en Tren Interoceánico",
    "Cita Romántica a Solas, Flores, Serenata",
    "Concierto de Romeo",
    "Dedicatoria Sorpresa en Bar con Música en Vivo",
    "Cita de Planeación Sexual",
    "Día de Casa (Salón VIP): Rizos y comida",
    "Correr en carritos de playa (Buggies)"
  ];

  const wishlistRegalos = [
    "(Ejemplo) El perfume que mencionó en el mall",
    "(Ejemplo) Un libro del autor que le gusta",
    "Anota aquí cualquier detalle sutil..."
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
          Arquitectura de Experiencias
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Director: Jeffreey | Método Taraban & Contraste
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
          <Tab label="📅 Logística Mensual" />
          <Tab label="🗺️ Mapa Anual" />
          <Tab label="📥 Inbox (Backlog)" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((semana) => (
            <Grid xs={12} md={6} key={semana}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '1px solid #333' }}>
                <Box sx={{ bgcolor: '#333', p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Semana {semana}
                  </Typography>
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalBarIcon fontSize="small" /> CITA FUERTE
                      </Typography>
                      <Chip label="Por definir" size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ pl: 2, borderLeft: '3px solid #666' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>[Transición: Cortar el estrés]</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>[Clímax: Contraste y validación]</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>[Cambio de Energía: Tensión sexual]</Typography>
                      <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic', mb: 0.5 }}>[Diseño Íntimo: Coreografía sexual y Aftercare]</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>[Gancho Final: Anticipación]</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CoffeeIcon fontSize="small" /> ENCUENTRO LIGERO
                      </Typography>
                      <Chip label="Por definir" size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ pl: 2, borderLeft: '3px solid #666' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Objetivo: Conexión rápida, validación y retirada.
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Grid container spacing={2}>
          {anual.map((hito, i) => (
            <Grid xs={12} key={i}>
              <Card elevation={1} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, border: '1px solid #333' }}>
                <Box sx={{ fontSize: 30, mr: 3 }}>{hito.icono}</Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{hito.mes}</Typography>
                  <Typography variant="body1" color="text.secondary">{hito.evento}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">🎁 WISHLIST SECRETA</Typography>
              </Box>
              <List>
                {wishlistRegalos.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}><CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }}/></ListItemIcon>
                    <ListItemText primary={item} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">💖 IDEAS DE DEI</Typography>
              </Box>
              <List>
                {inboxElla.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}><CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }}/></ListItemIcon>
                    <ListItemText primary={item} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">👑 IDEAS DE JEFF</Typography>
              </Box>
              <List>
                {inboxJeff.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}><CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }}/></ListItemIcon>
                    <ListItemText primary={item} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

    </Container>
  );
}
