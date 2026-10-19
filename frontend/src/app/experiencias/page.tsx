'use client';
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
      {value === index && <Box sx={{ p: { xs: 1.5, md: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function ExperienciasPlanner() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const halloweenOptions = [
    {
      id: 'opcion-1',
      badge: '⭐ RECOMENDADA (2 Hitos del Mapa Anual en 1)',
      titulo: 'Opción 1: Tántalo Kitchen & Roofbar + Noche en Hotel Boutique (Casco Antiguo)',
      concepto:
        'Evitan el tranque mortal de salida de Casco en Halloween. Hacen check-in en la tarde, se visten y maquillan juntos en la habitación con música y un trago (Transición), suben al Rooftop a cenar y disfrutar la fiesta de disfraces (Clímax), y a la 1:00 a.m. bajan en ascensor directo a su habitación privada (Diseño Íntimo).',
      costos: [
        '🍽️ Cena + Cócteles para 2 (Tántalo Kitchen o Lazotea a 1 cuadra): $75 – $110',
        '🎟️ Cover Fiesta Halloween Rooftop: $0 – $40 (suele incluirse al hospedarse o reservar cena temprano)',
        '🏨 Noche en Hotel Boutique en Casco: Tántalo Hotel / Magnolia ($95 – $135) o Central Hotel con piscina ($165 – $210)',
      ],
      totalSinHotel: '$95 – $140 USD',
      totalConHotel: '$190 – $275 USD',
      ventaja: 'Cero estrés de estacionamiento, máxima intimidad al cerrar la noche y cumples el hito de "Cena en Casco + Hotel Boutique".',
    },
    {
      id: 'opcion-2',
      badge: '✨ SOFISTICADA & SEXY (Con Piscina en Azotea)',
      titulo: 'Opción 2: Lazotea Restaurant & Rooftop (Casco Antiguo)',
      concepto:
        'Alta gastronomía latinoamericana y coctelería de autor en un rooftop elegante con piscina iluminada y vista al skyline. Ideal para lucir un disfraz en pareja sexy/elegante, cenar a las 7:30 p.m. y quedarse cuando el rooftop se transforma en fiesta temática de Halloween a las 10:00 p.m.',
      costos: [
        '🍽️ Cena de 3 tiempos + 2 cócteles c/u: $90 – $135',
        '🎟️ Acceso fiesta Halloween (reservando mesa de cena antes de las 8:00 p.m.): $0 – $30',
        '🚗 Uber ida y vuelta (para tomar tranquilos y no buscar parking en Casco): $15 – $25',
      ],
      totalSinHotel: '$110 – $165 USD',
      totalConHotel: '$230 – $295 USD (sumando hotel como W Panama $135 o Hotel Boutique en Casco)',
      ventaja: 'El mejor balance entre cena romántica de alto nivel, fotos brutales junto a la piscina y buena rumba.',
    },
    {
      id: 'opcion-3',
      badge: '🍣 SUSHI + MANSIÓN DE HALLOWEEN (5 Pisos)',
      titulo: 'Opción 3: Casa Casco — Cena en Koböre (Sushi/Asiático) + Rooftop 360° + Club',
      concepto:
        'Casa Casco transforma sus 5 pisos frente a Plaza Herrera en una mansión de Halloween. Empiezan cenando sushi y platos asiáticos en Koböre (sabiendo que a Dei le encanta el sushi), suben al Rooftop 360° para fotos y cócteles, y bajan al Club del piso intermedio a bailar.',
      costos: [
        '🍣 Cena en Koböre / Marula + cócteles para 2: $85 – $130',
        '🎃 Preventa fiesta Halloween Casa Casco (Passline / MiEventos): $30 – $50 por pareja ($15–$25 c/u)',
        '🚗 Uber / Logística: $15 – $25',
      ],
      totalSinHotel: '$120 – $185 USD',
      totalConHotel: '$220 – $300 USD',
      ventaja: 'La decoración más impresionante de Halloween en Casco y tres ambientes distintos sin cambiar de edificio.',
    },
  ];

  const octubreSemanas = [
    {
      semana: 'Semana 1 (1 – 8 Oct)',
      estado: 'Completada ✅',
      citaFuerte: 'La Historia de la Lancha ("Eres la mujer de mi vida") y Noche juntos ("Tú friita y yo calientito") 🔥❄️',
      encuentroLigero: 'Almuerzos consentidos en el turno + Cita de madrugada: Shawarma y Juguitos 🥙🥤',
    },
    {
      semana: 'Semana 2 (9 – 14 Oct)',
      estado: 'Completada ✅',
      citaFuerte: '¡Dei conoce de sorpresa a mi Mamá y a mi Abuelito en Sabroso! + Día Familiar e Incondicional 👨‍👩‍👦❤️',
      encuentroLigero: 'Cuidado mutuo durante el día del temblor y las réplicas 🌍🙏',
    },
    {
      semana: 'Semana 3 (15 – 22 Oct)',
      estado: 'Completada ✅',
      citaFuerte: 'Cena de 2do Mes de Aniversario ("¡Te amo ❤️, Feliz Aniversario!") 🥂💐',
      encuentroLigero: 'Heladito sorpresa de naranja-piña + Cena nocturna y paseo juntos en moto 🛵🌙',
    },
    {
      semana: 'Semana 4 (23 – 31 Oct)',
      estado: 'En Planeación 🎃',
      citaFuerte: 'SÁBADO 31 DE OCTUBRE: Noche de Halloween Disfrazados en Pareja (Cena + Rooftop + Aftercare) 🎃👻🍷',
      encuentroLigero: 'Elegir y probarnos los disfraces juntos en la semana previa ✨',
    },
  ];

  const anual = [
    { mes: 'Agosto 2026', evento: 'Inicio del Planeador (Mr. Bono y El Dorado)', icono: '✅' },
    { mes: 'Septiembre 2026', evento: 'Aniversario: Regalar Flores y Canción Original (15/09)', icono: '💐' },
    { mes: 'Septiembre 2026', evento: 'Día de las Flores Amarillas (21/09)', icono: '🌻' },
    { mes: 'Octubre 2026', evento: 'Aniversario 2do Mes (15/10) + Paseo en Moto', icono: '✅' },
    { mes: 'Octubre 2026 (31/10)', evento: 'EN PLANEACIÓN: Celebrar Halloween Juntos Disfrazados (+ Cena en Casco / Hotel Boutique)', icono: '🎃' },
    { mes: 'Noviembre 2026', evento: 'Cenar en Casco Antiguo y Hotel Boutique', icono: '🍷' },
    { mes: 'Diciembre 2026', evento: 'Regalo de Flores (15/12 - Trimestral)', icono: '💐' },
    { mes: 'Diciembre 2026', evento: 'Plan de Navidad - "La Navidad Más Linda"', icono: '🎄' },
    { mes: 'Enero 2027', evento: 'Tirarse de un Avión en Paracaídas (29/01)', icono: '🪂' },
    { mes: 'Enero 2027', evento: 'Cenar en Casco Antiguo y Hotel Boutique', icono: '🍷' },
    { mes: 'Marzo 2027', evento: 'Regalo de Flores (15/03 - Trimestral)', icono: '💐' },
  ];

  const inboxElla = [
    'Tour de avistamiento de ballenas',
    'Plan Artístico de Moldeado de Arcilla',
    'Desayuno en restaurante Koreano y tomar té',
    'Día de Playa',
    'Día de Casa: Tú le cocinas, ella disfruta',
    'Salir a Bailar Música Latina',
    'Ir a la Iglesia juntos',
    'Enseñanza de Skateboard',
  ];

  const inboxJeff = [
    'Tour en Tren Interoceánico',
    'Cita Romántica a Solas, Flores, Serenata',
    'Concierto de Romeo',
    'Dedicatoria Sorpresa en Bar con Música en Vivo',
    'Cita de Planeación Íntima',
    'Día de Casa (Salón VIP): Rizos y comida',
    'Correr en carritos de playa (Buggies)',
  ];

  const wishlistRegalos = [
    'Disfraz en pareja para Halloween (que Dei estuvo viendo desde el 28/09)',
    'Escapada de día lluvioso viendo películas y One Piece acurrucados',
    'Tocarle una canción en el acordeón',
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
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="🎃 Plan Halloween (31 Oct)" />
          <Tab label="📅 Logística Octubre" />
          <Tab label="🗺️ Mapa Anual" />
          <Tab label="📥 Inbox (Backlog)" />
        </Tabs>
      </Box>

      {/* TAB 0: OPERACIÓN HALLOWEEN */}
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            🎃 Operación Halloween con Dei — Sábado 31 de Octubre
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fase 1: Comparativa de Lugares para Reservar y Presupuesto Estimado en Ciudad de Panamá (para 2 personas).
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {halloweenOptions.map((opt) => (
            <Grid xs={12} key={opt.id}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '1px solid rgba(233, 30, 99, 0.35)' }}>
                <Box sx={{ bgcolor: 'rgba(233, 30, 99, 0.12)', px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#e91e63' }}>
                    {opt.badge}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`Sin hotel: ${opt.totalSinHotel}`} size="small" color="primary" variant="outlined" />
                    <Chip label={`Con hotel: ${opt.totalConHotel}`} size="small" sx={{ bgcolor: '#e91e63', color: '#fff', fontWeight: 'bold' }} />
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                    {opt.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {opt.concepto}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                    💰 Desglose de Costos (Estimado para Jeff y Dei):
                  </Typography>
                  {opt.costos.map((c, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5, pl: 1 }}>
                      • {c}
                    </Typography>
                  ))}
                  <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      🎯 Ventaja Estratégica (Método Taraban): {opt.ventaja}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card elevation={2} sx={{ mt: 4, borderRadius: 3, border: '1px solid #444' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
              📐 Arquitectura Taraban de la Noche (31 de Octubre)
            </Typography>
            <Box sx={{ pl: 2, borderLeft: '3px solid #e91e63', display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>1. Transición (Cortar el estrés):</strong> Recoger a Dei sin prisa o llegar temprano al hotel boutique; poner playlist para arreglarse y vestirse con los disfraces juntos tomando el primer brindis privado.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>2. Clímax (Contraste y Validación):</strong> Entrada al Rooftop en Casco Antiguo (7:30 p.m. – 8:00 p.m.), sesión de fotos luciendo los disfraces, cena deliciosa y cócteles de autor mientras sube la energía de la fiesta.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>3. Cambio de Energía (Tensión Romántica):</strong> Bailar juntos en la fiesta de disfraces y retirarse en el punto más alto de la noche (12:30 a.m. – 1:00 a.m.) antes del agotamiento o el tráfico.
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>4. Diseño Íntimo y Aftercare:</strong> Cierre privado solo para los dos (en el hotel boutique o en casa), quitarse los disfraces, música suave y su comida/snack favorito de madrugada.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>5. Gancho Final (Anticipación):</strong> Desayuno juntos el domingo 1 de noviembre y enviarle la mejor foto impresa o editada de la noche.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </CustomTabPanel>

      {/* TAB 1: LOGÍSTICA MENSUAL OCTUBRE */}
      <CustomTabPanel value={value} index={1}>
        <Grid container spacing={3}>
          {octubreSemanas.map((item, idx) => (
            <Grid xs={12} md={6} key={idx}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '1px solid #333', height: '100%' }}>
                <Box sx={{ bgcolor: idx === 3 ? 'rgba(233, 30, 99, 0.2)' : '#333', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {item.semana}
                  </Typography>
                  <Chip
                    label={item.estado}
                    size="small"
                    color={idx === 3 ? 'secondary' : 'success'}
                    variant="outlined"
                  />
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalBarIcon fontSize="small" sx={{ color: '#e91e63' }} /> CITA FUERTE
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.citaFuerte}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CoffeeIcon fontSize="small" /> ENCUENTRO LIGERO
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.encuentroLigero}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      {/* TAB 2: MAPA ANUAL */}
      <CustomTabPanel value={value} index={2}>
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

      {/* TAB 3: INBOX */}
      <CustomTabPanel value={value} index={3}>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">🎁 WISHLIST & PRÓXIMOS DETALLES</Typography>
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
