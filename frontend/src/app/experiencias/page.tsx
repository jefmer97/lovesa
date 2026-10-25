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
  Button,
} from '@mui/material';
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
      {value === index && <Box sx={{ p: { xs: 1.5, md: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function ExperienciasPlanner() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const whatsappMsg = encodeURIComponent(
    'Hola! 👋 Quisiéramos hacer una reserva de cena para 2 personas este sábado 31 de octubre a las 7:30 p.m. en el Rooftop, a nombre de Jeffreey. ¡Muchas gracias!',
  );

  const venues = [
    {
      id: 'lazotea',
      badge: '⭐ OPCIÓN A (MÁS ESTÉTICA PARA FOTOS LANA & THE WEEKND)',
      titulo: 'Lazotea Restaurant & Rooftop (Casco Antiguo)',
      whatsapp: '+507 6851-6431',
      whatsappUrl: `https://wa.me/50768516431?text=${whatsappMsg}`,
      concepto:
        'Rooftop elegante con piscina iluminada y vista al skyline de Panamá. La estética nocturna con luces cálidas y reflejos en el agua queda de videoclip de "Lust for Life" / "Stargirl Interlude". Si reservan cena a las 7:30 p.m., cenan tranquilos y a las 10:00 p.m. ya están adentro cuando empieza la fiesta de Halloween sin pagar cover de discoteca.',
      menuRecomendado: [
        '🍤 Entrada para compartir: Tartar de Salmón en wantón ($14) o Stracciatella de Burrata ($14)',
        '🍽️ Plato fuerte Dei: Mac & Cheese Trufado ($14) o Tiradito ($19)',
        '🍽️ Plato fuerte Jeff: Pao de Queijo e Porco ($19) o Tacos de Langosta ($28)',
        '🍸 4 Cócteles de Autor (2 para Dei + 2 para ti, ~$13 c/u): ~$52',
      ],
      totalEstimado: '$110 – $135 USD (Total los 2 con impuestos)',
    },
    {
      id: 'tantalo',
      badge: '🔥 OPCIÓN B (MÁS FIESTERA Y RELAJADA)',
      titulo: 'Tántalo Kitchen & Roofbar (Casco Antiguo)',
      whatsapp: '+507 6616-5079',
      whatsappUrl: `https://wa.me/50766165079?text=${whatsappMsg}`,
      concepto:
        'El rooftop más famoso de Casco por su ambiente de fiesta y DJ en vivo. Reservando a las 7:30 p.m. piden platos al centro para picar y cócteles de autor, y se quedan directo en la fiesta de disfraces.',
      menuRecomendado: [
        '🥓 Entrada para compartir: Belly Dance (Pork Belly crocante, $15) + Croquetas ($12)',
        '🐙 Platos principales: Empanada C3 de Pulpo ($16) + Angus Burger ($17)',
        '🍸 4 Cócteles de Autor ("Noche en el Casco" / "Patrón Mule", ~$12 c/u): ~$48',
      ],
      totalEstimado: '$100 – $120 USD (Total los 2 con impuestos)',
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
      citaFuerte: 'Cena de 2do Mes de Aniversario ("¡Te amo ❤️, Feliz Aniversario!") 🥂💐 + Primera visita juntos a APLAFA para empezar a planificar (20/10) 🏥💑',
      encuentroLigero: 'Heladito sorpresa de naranja-piña + Cena nocturna y paseo juntos en moto 🛵🌙',
    },
    {
      semana: 'Semana 4 (23 – 31 Oct)',
      estado: 'Confirmada 🎃',
      citaFuerte: 'SÁBADO 31 DE OCTUBRE: Halloween "The Weeknd & Lana Del Rey" — Cena + Fiesta en Rooftop de Casco Antiguo ($105–$130) y regreso a dormir juntos a casa 🕶️🌹🍷',
      encuentroLigero: 'Armar y probarnos los outfits de The Weeknd y Lana Del Rey esta semana ✨',
    },
  ];

  const anual = [
    { mes: 'Agosto 2026', evento: 'Inicio del Planeador (Mr. Bono y El Dorado)', icono: '✅' },
    { mes: 'Septiembre 2026', evento: 'Aniversario: Regalar Flores y Canción Original (15/09)', icono: '💐' },
    { mes: 'Septiembre 2026', evento: 'Día de las Flores Amarillas (21/09)', icono: '🌻' },
    { mes: 'Octubre 2026', evento: 'Aniversario 2do Mes (15/10) + Primera visita a APLAFA (20/10)', icono: '✅' },
    { mes: 'Octubre 2026 (31/10)', evento: 'CONFIRMADO: Halloween "The Weeknd & Lana Del Rey" en Casco Antiguo', icono: '🎃' },
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
    'Corona de rosas rojas o accesorio vintage para el outfit de Lana Del Rey de Dei (31/10)',
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
          <Tab label="🎃 Plan Halloween: The Weeknd & Lana (31 Oct)" />
          <Tab label="📅 Logística Octubre" />
          <Tab label="🗺️ Mapa Anual" />
          <Tab label="📥 Inbox (Backlog)" />
        </Tabs>
      </Box>

      {/* TAB 0: PLAN MAESTRO HALLOWEEN */}
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: 'rgba(233, 30, 99, 0.1)', border: '1px solid rgba(233, 30, 99, 0.35)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              🕶️🌹 Halloween: The Weeknd & Lana Del Rey
            </Typography>
            <Chip label="Presupuesto Meta: $80 – $140 USD" sx={{ bgcolor: '#e91e63', color: '#fff', fontWeight: 'bold' }} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            <strong>Fecha:</strong> Sábado 31 de Octubre (Reserva 7:30 p.m.) • <strong>Formato:</strong> Cena + Cócteles + Fiesta en Rooftop de Casco Antiguo y regreso a casa para dormir juntos.
          </Typography>
        </Box>

        {/* SECCIÓN 1: OUTFITS / DISFRACES */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, border: '1px solid #444' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                  🌹 Outfit de Dei: Lana Del Rey (Born to Die / Lust for Life)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Estética retro, sensual y súper fotogénica (además muy cómoda para cenar y bailar):
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  • <strong>Vestido:</strong> Vestido corto blanco (encaje/satén) o rojo vino estilo vintage.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  • <strong>Cabello & Detalle Sorpresa:</strong> Ondas sueltas tipo Hollywood retro + <strong>corona o diadema de rosas rojas</strong> (¡puedes llevársela tú de sorpresa antes de salir!).
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Maquillaje & Accesorios:</strong> Delineado <em>cat-eye</em> marcado, labios rojos/vino y collar de corazón o perlas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, border: '1px solid #444' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                  🕶️ Outfit de Jeff: The Weeknd (After Hours o Starboy)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Dos versiones fáciles de armar esta semana en Panamá:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                  • <strong>Versión A — After Hours / Blinding Lights (La más icónica):</strong> Saco/blazer rojo (o vino/negro), camisa de vestir negra por dentro, corbata negra delgada, lentes oscuros cuadrados retro y una curita/bandita en la nariz para las fotos.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Versión B — Starboy (Más fresca para bailar):</strong> Chaqueta negra tipo cuero o bomber, t-shirt negra entallada, pantalón negro, cadena plateada y lentes oscuros.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SECCIÓN 2: RESERVA DE LUGAR Y PRESUPUESTO */}
        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
          📍 Paso 1: Reservar Mesa a las 7:30 p.m. (Truco para Cero Cover + Mesa Asegurada)
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {venues.map((v) => (
            <Grid xs={12} md={6} key={v.id}>
              <Card elevation={3} sx={{ height: '100%', borderRadius: 3, border: '1px solid rgba(233, 30, 99, 0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ bgcolor: 'rgba(233, 30, 99, 0.12)', px: 2.5, py: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#e91e63' }}>
                      {v.badge}
                    </Typography>
                    <Chip label={v.totalEstimado} size="small" color="success" variant="outlined" />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                      {v.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.55 }}>
                      {v.concepto}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                      🍽️ Combinación Exacta para Cuidar el Presupuesto ($80–$140):
                    </Typography>
                    {v.menuRecomendado.map((m, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        • {m}
                      </Typography>
                    ))}
                  </CardContent>
                </Box>
                <Box sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    component="a"
                    href={v.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#22c55e', color: '#fff', fontWeight: 'bold', '&:hover': { bgcolor: '#16a34a' } }}
                  >
                    📲 Reservar por WhatsApp ({v.whatsapp})
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SECCIÓN 3: ARQUITECTURA TARABAN DE LA NOCHE */}
        <Card elevation={3} sx={{ borderRadius: 3, border: '1px solid #444' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
              📐 Guion Completo de la Noche (Método Taraban — Sábado 31 de Octubre)
            </Typography>
            <Box sx={{ pl: 2, borderLeft: '3px solid #e91e63', display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>1. Transición (6:00 p.m. – 7:15 p.m. | Romper la rutina y subir energía):</strong> Antes de salir hacia Casco, deja tu habitación arreglada y perfumada para el regreso. Al verla vestida de Lana Del Rey, entrégale un detalle sorpresa (unas rosas rojas que combinen con su personaje) y pon en el carro/casa <em>«El Incomprendido» de Ismael Rivera</em> para sacarle una sonrisa inmediata seguida de <em>«Lust for Life» (Lana Del Rey ft. The Weeknd)</em>.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>2. Clímax (7:30 p.m. – 11:30 p.m. | Contraste, Fotos y Fiesta en Rooftop):</strong> Llegada puntual a las 7:30 p.m. al Rooftop en Casco Antiguo. Sesión de fotos en pareja estilo <em>The Weeknd & Lana Del Rey</em> con el skyline de fondo, cena para compartir y cócteles de autor mientras el rooftop se llena y arranca el DJ de Halloween.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>3. Cambio de Energía (11:30 p.m. – 12:45 a.m. | Tensión Romántica):</strong> Bailar pegaditos con sus tragos y retirarse en el punto más alto de la noche (~12:45 a.m. – 1:00 a.m.) antes del agotamiento o del trancón pesado de las 3:00 a.m.
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>4. Diseño Íntimo y Aftercare en Casa (1:15 a.m. en adelante):</strong> Llegar a casa donde todo ya está listo. Poner de fondo <em>«Stargirl Interlude»</em>, <em>«Prisoner»</em> y <em>«The Abyss»</em> (las colaboraciones más sensuales de The Weeknd y Lana Del Rey), quitarse los disfraces, disfrutar su noche juntos y cerrar con su comidita/snack favorito y dormir abrazaditos (<em>«Tú friita y yo calientito»</em>).
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>5. Gancho Final (Domingo 1 de Noviembre):</strong> Despertar juntos, desayunar rico y subir/enviarle la mejor foto de ustedes como <em>The Weeknd & Lana Del Rey</em>.
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
