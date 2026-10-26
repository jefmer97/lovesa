'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Sparkles,
  Clock,
  MapPin,
  Music,
  CheckCircle2,
  Circle,
  DollarSign,
  Flame,
  Camera,
  Heart,
  ExternalLink,
  MessageCircle,
  Wine,
  Utensils,
  Moon,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  category: 'logistica' | 'outfit_jeff' | 'outfit_dei' | 'casa';
  done: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  // Logística
  {
    id: 'res-wa',
    label: 'Escribir por WhatsApp para reservar mesa 7:30 p.m. (sábado 31 oct)',
    category: 'logistica',
    done: false,
  },
  {
    id: 'rosas-dei',
    label: 'Comprar corona/diadema de rosas rojas o ramo de rosas para Dei (sorpresa de Transición)',
    category: 'logistica',
    done: false,
  },
  {
    id: 'playlist-ready',
    label: 'Tener lista la Playlist: "El Incomprendido" + The Weeknd & Lana Del Rey',
    category: 'logistica',
    done: false,
  },
  // Outfit Jeff (The Weeknd)
  {
    id: 'jeff-jacket',
    label: 'Saco/Blazer rojo o negro (After Hours) o Chaqueta negra de cuero (Starboy)',
    category: 'outfit_jeff',
    done: false,
  },
  {
    id: 'jeff-shirt',
    label: 'Camisa negra + corbata negra delgada (o T-shirt negra con cadena plateada)',
    category: 'outfit_jeff',
    done: false,
  },
  {
    id: 'jeff-glasses',
    label: 'Lentes oscuros retro cuadrados + curita/bandita en la nariz para las fotos',
    category: 'outfit_jeff',
    done: false,
  },
  // Outfit Dei (Lana Del Rey)
  {
    id: 'dei-dress',
    label: 'Vestido corto blanco (encaje/satén) o rojo vino estilo vintage',
    category: 'outfit_dei',
    done: false,
  },
  {
    id: 'dei-hair',
    label: 'Ondas retro Hollywood + delineado cat-eye y labial rojo/vino',
    category: 'outfit_dei',
    done: false,
  },
  {
    id: 'dei-acc',
    label: 'Collar de corazón/perlas + rosas rojas en el cabello',
    category: 'outfit_dei',
    done: false,
  },
  // Preparación de Casa (Diseño Íntimo & Aftercare)
  {
    id: 'casa-sabanas',
    label: 'Dejar la habitación impecable, sábanas limpias, aroma rico e iluminación tenue antes de salir',
    category: 'casa',
    done: false,
  },
  {
    id: 'casa-snacks',
    label: 'Tener bebidas frías, agua y su snack/antojo favorito listo para las 1:15 a.m.',
    category: 'casa',
    done: false,
  },
];

const VENUES = {
  lazotea: {
    name: 'Lazotea Restaurant & Rooftop',
    subtitle: 'Casco Antiguo • Rooftop con Piscina Iluminada & Skyline',
    badge: '⭐ Recomendado para fotos estilo videoclip Lana & The Weeknd',
    whatsapp: '+507 6851-6431',
    whatsappLink:
      'https://wa.me/50768516431?text=' +
      encodeURIComponent(
        'Hola! 👋 Quisiéramos hacer una reserva de cena para 2 personas este sábado 31 de octubre a las 7:30 p.m. en el Rooftop, a nombre de Jeffreey. ¡Muchas gracias!',
      ),
    vibe: 'Sofisticado, sensual, piscina iluminada en la azotea, excelente gastronomía del chef Jorge Rausch y transición a fiesta a las 10:00 p.m. sin pagar cover llegando a cenar a las 7:30 p.m.',
    items: [
      { name: 'Entrada al centro: Tartar de Salmón o Burrata', price: 14 },
      { name: 'Plato fuerte Dei: Mac & Cheese Trufado o Tiradito', price: 19 },
      { name: 'Plato fuerte Jeff: Pao de Queijo e Porco', price: 19 },
      { name: '4 Cócteles de Autor (2 para Dei + 2 para Jeff)', price: 52 },
      { name: 'Impuestos + Propina sugerida (~17%)', price: 18 },
    ],
    total: 122,
  },
  tantalo: {
    name: 'Tántalo Kitchen & Roofbar',
    subtitle: 'Casco Antiguo • El Rooftop más fiestero y artístico',
    badge: '🔥 Ideal para ambiente de rumba intensa y tapas para compartir',
    whatsapp: '+507 6616-5079',
    whatsappLink:
      'https://wa.me/50766165079?text=' +
      encodeURIComponent(
        'Hola! 👋 Quisiéramos hacer una reserva de cena para 2 personas este sábado 31 de octubre a las 7:30 p.m. en el Roofbar, a nombre de Jeffreey. ¡Muchas gracias!',
      ),
    vibe: 'Vibrante, juvenil, pared jardín vertical iluminada, tapas deliciosas para picar al centro y DJ en vivo toda la noche.',
    items: [
      { name: 'Entrada: Belly Dance (Pork Belly crocante)', price: 15 },
      { name: 'Plato 1: Empanada C3 de Pulpo afrostyle', price: 16 },
      { name: 'Plato 2: Angus Burger con mermelada de bacon', price: 17 },
      { name: '4 Cócteles de Autor ("Noche en el Casco" / "Patrón Mule")', price: 48 },
      { name: 'Impuestos + Propina sugerida (~17%)', price: 16 },
    ],
    total: 112,
  },
};

const TARABAN_TIMELINE = [
  {
    step: 'FASE 1',
    time: '6:00 PM – 7:15 PM',
    title: 'Transición: Romper la rutina y entrar en personaje',
    color: '#f59e0b',
    icon: Sparkles,
    summary: 'Preparar el nido antes de salir y sorprenderla al verla vestida de Lana Del Rey.',
    details: [
      'Antes de salir de casa: deja tu cuarto arreglado, climatizado, con olor rico y snacks listos para la madrugada.',
      'Al recoger a Dei: entrégale las rosas rojas (para su look de Lana Del Rey) y dile lo espectacular que se ve.',
      'Pon en el sonido primero «El Incomprendido» de Ismael Rivera para sacarle una sonrisa cómplice inmediata, y enseguida pon «Lust for Life» (Lana Del Rey ft. The Weeknd).',
    ],
    song: '🎵 Soundtrack: El Incomprendido (Ismael Rivera) ➔ Lust for Life (Lana & The Weeknd)',
  },
  {
    step: 'FASE 2',
    time: '7:30 PM – 10:00 PM',
    title: 'Clímax Parte I: Entrada al Rooftop, Fotos & Cena',
    color: '#e91e63',
    icon: Camera,
    summary: 'Llegar con mesa reservada sin fila ni cover, sesión de fotos y cena deliciosa.',
    details: [
      'Llegada puntual a las 7:30 p.m. al Rooftop en Casco Antiguo (mientras todavía es fácil entrar sin tranque).',
      'Sesión de fotos en pareja estilo póster de película (tú con lentes oscuros y actitud The Weeknd, ella como Lana Del Rey con el skyline detrás).',
      'Pedir entrada al centro + platos fuertes y el primer par de cócteles de autor.',
    ],
    song: '🎵 Vibe: Starboy • West Coast • Blinding Lights',
  },
  {
    step: 'FASE 3',
    time: '10:00 PM – 12:45 AM',
    title: 'Clímax Parte II & Cambio de Energía: Fiesta y Tensión',
    color: '#a855f7',
    icon: Flame,
    summary: 'Disfrutar la fiesta de disfraces en el Rooftop y retirarse en el punto más alto.',
    details: [
      'A las 10:00 p.m. el Rooftop sube la música y se llena de disfraces; ustedes ya tienen su lugar asegurado.',
      'Segundo cóctel, bailar pegaditos, miradas cómplices y disfrutar el ambiente de Halloween.',
      'REGLA DE ORO TARABAN: Salir de Casco entre 12:45 a.m. y 1:00 a.m. cuando la energía entre los dos está al máximo y antes del trancón pesado de las 2:30 a.m.',
    ],
    song: '🎵 Vibe: Party Monster • Summertime Sadness • Música Latina',
  },
  {
    step: 'FASE 4',
    time: '1:15 AM – Madrugada',
    title: 'Diseño Íntimo & Aftercare en Casa',
    color: '#ec4899',
    icon: Flame,
    summary: 'El verdadero cierre privado: música sensual, intimidad y dormir abrazaditos.',
    details: [
      'Llegar directo a tu habitación que dejaste lista desde las 6:00 p.m.',
      'Poner la playlist lenta de The Weeknd & Lana Del Rey: «Stargirl Interlude», «Prisoner», «The Abyss» y «Earned It».',
      'Quitarse los disfraces sin prisa, disfrutar su noche juntos y cerrar con su comidita/snack favorito y dormir acurrucados («Tú friita y yo calientito»).',
    ],
    song: '🎵 Soundtrack Íntimo: Stargirl Interlude • Prisoner • The Abyss',
  },
  {
    step: 'FASE 5',
    time: 'Domingo 1 de Noviembre',
    title: 'Gancho Final: Despertar juntos y el recuerdo perfecto',
    color: '#10b981',
    icon: Heart,
    summary: 'Sellar la memoria emocional al día siguiente.',
    details: [
      'Despertar abrazados el domingo sin prisa y desayunar rico juntos.',
      'Elegir la mejor foto de ustedes como The Weeknd & Lana Del Rey y subirla también a la línea de tiempo de Lovesa.',
    ],
    song: '🎵 Vibe de Domingo: Young and Beautiful • Die For You',
  },
];

const PLAYLIST_SONGS = [
  {
    title: 'El Incomprendido',
    artist: 'Ismael Rivera',
    moment: 'Sorpresa al recogerla (Su favorita 💖)',
    yt: 'https://www.youtube.com/results?search_query=El+Incomprendido+Ismael+Rivera',
  },
  {
    title: 'Lust for Life',
    artist: 'Lana Del Rey ft. The Weeknd',
    moment: 'Camino a Casco Antiguo',
    yt: 'https://www.youtube.com/results?search_query=Lana+Del+Rey+The+Weeknd+Lust+for+Life',
  },
  {
    title: 'Stargirl Interlude',
    artist: 'The Weeknd ft. Lana Del Rey',
    moment: 'Cierre Íntimo en Casa (1:15 a.m.)',
    yt: 'https://www.youtube.com/results?search_query=Stargirl+Interlude+The+Weeknd+Lana+Del+Rey',
  },
  {
    title: 'Prisoner',
    artist: 'The Weeknd ft. Lana Del Rey',
    moment: 'Cierre Íntimo en Casa',
    yt: 'https://www.youtube.com/results?search_query=Prisoner+The+Weeknd+Lana+Del+Rey',
  },
  {
    title: 'The Abyss',
    artist: 'The Weeknd & Lana Del Rey',
    moment: 'Noche / After Hours',
    yt: 'https://www.youtube.com/results?search_query=The+Weeknd+Lana+Del+Rey+The+Abyss',
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    moment: 'Fotos en el Rooftop',
    yt: 'https://www.youtube.com/results?search_query=The+Weeknd+Blinding+Lights',
  },
];

export default function HalloweenVisualPlanPage() {
  const [selectedVenue, setSelectedVenue] = useState<'lazotea' | 'tantalo'>('lazotea');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [activePhase, setActivePhase] = useState<number>(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lovesa_halloween_checklist_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChecklist(parsed);
        }
      }
      const savedVenue = localStorage.getItem('lovesa_halloween_venue');
      if (savedVenue === 'lazotea' || savedVenue === 'tantalo') {
        setSelectedVenue(savedVenue);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date('2026-10-31T19:30:00-05:00').getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setCountdown({ days, hours, mins });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 30000);
    return () => clearInterval(timer);
  }, []);

  const toggleCheck = (id: string) => {
    setChecklist((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      );
      try {
        localStorage.setItem('lovesa_halloween_checklist_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSelectVenue = (v: 'lazotea' | 'tantalo') => {
    setSelectedVenue(v);
    try {
      localStorage.setItem('lovesa_halloween_venue', v);
    } catch (e) {}
  };

  const venue = VENUES[selectedVenue];
  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 10 }}>
      {/* HERO BANNER CINEMATOGRÁFICO: THE WEEKND & LANA DEL REY */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          mb: 4,
          background:
            'linear-gradient(135deg, #1a050d 0%, #3b071e 45%, #7f1d1d 80%, #111827 100%)',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(233, 30, 99, 0.25)',
          border: '1px solid rgba(233, 30, 99, 0.4)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} md={8}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label="🎃 SÁBADO 31 DE OCTUBRE • 7:30 P.M."
                sx={{
                  bgcolor: 'rgba(233, 30, 99, 0.25)',
                  color: '#fbcfe8',
                  fontWeight: 700,
                  border: '1px solid rgba(233, 30, 99, 0.5)',
                }}
              />
              <Chip
                label="💰 PRESUPUESTO META: $80 – $140 USD"
                sx={{
                  bgcolor: 'rgba(34, 197, 94, 0.2)',
                  color: '#bbf7d0',
                  fontWeight: 700,
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                }}
              />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                mb: 1.5,
              }}
            >
              THE WEEKND & LANA DEL REY 🕶️🌹
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.15rem' },
                maxWidth: 680,
                lineHeight: 1.5,
              }}
            >
              Plan Visual de Halloween para <strong>Jeff & Dei</strong>: Cena + Cócteles + Fiesta de Disfraces en Rooftop de Casco Antiguo y regreso a casa para nuestro cierre íntimo.
            </Typography>
          </Grid>

          <Grid xs={12} md={4}>
            <Box
              sx={{
                bgcolor: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2.5,
                border: '1px solid rgba(255,255,255,0.15)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  color: '#f472b6',
                  fontWeight: 700,
                }}
              >
                Cuenta Regresiva para la Cita
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  my: 1.5,
                }}
              >
                {[
                  { val: countdown.days, label: 'Días' },
                  { val: countdown.hours, label: 'Horas' },
                  { val: countdown.mins, label: 'Min' },
                ].map((t, i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      minWidth: 68,
                    }}
                  >
                    <Typography variant="h4" fontWeight="900" sx={{ color: '#fff' }}>
                      {t.val}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {t.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: '#bbf7d0', fontWeight: 600 }}>
                Preparación lista al {progressPercent}% ({completedCount}/{checklist.length})
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '& .MuiLinearProgress-bar': { bgcolor: '#22c55e' },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SECCIÓN 1: SELECTOR INTERACTIVO DE LUGAR, MENÚ Y PRESUPUESTO */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin color="#e91e63" size={28} />
              1. El Lugar, Reserva 7:30 P.M. y Presupuesto Exacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reservando cena a las 7:30 p.m. aseguran mesa sentados y entran gratis a la fiesta del Rooftop de las 10:00 p.m. (ahorrando $40–$50 de cover).
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant={selectedVenue === 'lazotea' ? 'contained' : 'outlined'}
              onClick={() => handleSelectVenue('lazotea')}
              sx={{
                bgcolor: selectedVenue === 'lazotea' ? '#e91e63' : 'transparent',
                color: selectedVenue === 'lazotea' ? '#fff' : 'text.primary',
                borderColor: '#e91e63',
                '&:hover': { bgcolor: selectedVenue === 'lazotea' ? '#c2185b' : 'rgba(233,30,99,0.1)' },
              }}
            >
              ⭐ Opción A: Lazotea ($122)
            </Button>
            <Button
              variant={selectedVenue === 'tantalo' ? 'contained' : 'outlined'}
              onClick={() => handleSelectVenue('tantalo')}
              sx={{
                bgcolor: selectedVenue === 'tantalo' ? '#e91e63' : 'transparent',
                color: selectedVenue === 'tantalo' ? '#fff' : 'text.primary',
                borderColor: '#e91e63',
                '&:hover': { bgcolor: selectedVenue === 'tantalo' ? '#c2185b' : 'rgba(233,30,99,0.1)' },
              }}
            >
              🔥 Opción B: Tántalo ($112)
            </Button>
          </Box>
        </Box>

        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            border: '2px solid rgba(233, 30, 99, 0.45)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(233, 30, 99, 0.12)',
              px: 3,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#e91e63' }}>
              {venue.badge}
            </Typography>
            <Chip
              label={`Total Estimado Pareja: $${venue.total} USD (Dentro de tu meta de $80–$140)`}
              color="success"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={7}>
                <Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
                  {venue.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                  {venue.subtitle}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {venue.vibe}
                </Typography>

                <Button
                  component="a"
                  href={venue.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  size="large"
                  startIcon={<MessageCircle size={20} />}
                  sx={{
                    bgcolor: '#22c55e',
                    color: '#fff',
                    fontWeight: 800,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': { bgcolor: '#16a34a' },
                  }}
                >
                  Reservar Mesa 7:30 P.M. por WhatsApp ({venue.whatsapp})
                </Button>
              </Grid>

              <Grid xs={12} md={5}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="800" color="text.primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Utensils size={18} color="#e91e63" />
                    Simulador de Cuenta (Para 2 Personas)
                  </Typography>
                  {venue.items.map((it, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: '1px dashed rgba(150,150,150,0.2)',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {it.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="text.primary">
                        ${it.price}
                      </Typography>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
                      pt: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="800" color="text.primary">
                      Total Estimado (Cover $0):
                    </Typography>
                    <Typography variant="h5" fontWeight="900" sx={{ color: '#22c55e' }}>
                      ${venue.total} USD
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* SECCIÓN 2: LOOKBOOK VISUAL DE DISFRACES (THE WEEKND & LANA DEL REY) */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Camera color="#e91e63" size={28} />
          2. Lookbook & Checklist de Disfraces en Pareja
        </Typography>

        <Grid container spacing={3}>
          {/* CARD DEI: LANA DEL REY */}
          <Grid xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 4,
                border: '1px solid rgba(236, 72, 153, 0.35)',
                background:
                  'linear-gradient(180deg, rgba(236, 72, 153, 0.08) 0%, rgba(0,0,0,0) 100%)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    label="🌹 DEI"
                    sx={{ bgcolor: '#ec4899', color: '#fff', fontWeight: 800 }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    Born to Die / Lust for Life Era
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="800" color="text.primary" gutterBottom>
                  Lana Del Rey
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Estética vintage de diva americana: femenina, sensual y comodísima para cenar y bailar toda la noche.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {checklist
                    .filter((c) => c.category === 'outfit_dei')
                    .map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'background.default',
                          border: item.done
                            ? '1px solid #22c55e'
                            : '1px solid rgba(150,150,150,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                        }}
                      >
                        {item.done ? (
                          <CheckCircle2 size={20} color="#22c55e" />
                        ) : (
                          <Circle size={20} color="#9ca3af" />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: item.done ? 'line-through' : 'none',
                            color: item.done ? 'text.secondary' : 'text.primary',
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD JEFF: THE WEEKND */}
          <Grid xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 4,
                border: '1px solid rgba(239, 68, 68, 0.35)',
                background:
                  'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(0,0,0,0) 100%)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    label="🕶️ JEFF"
                    sx={{ bgcolor: '#dc2626', color: '#fff', fontWeight: 800 }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    After Hours / Starboy Era
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="800" color="text.primary" gutterBottom>
                  The Weeknd
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Misterioso, elegante y masculino. Los lentes oscuros y el saco/chaqueta hacen que todo el mundo reconozca el personaje al instante.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {checklist
                    .filter((c) => c.category === 'outfit_jeff')
                    .map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'background.default',
                          border: item.done
                            ? '1px solid #22c55e'
                            : '1px solid rgba(150,150,150,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                        }}
                      >
                        {item.done ? (
                          <CheckCircle2 size={20} color="#22c55e" />
                        ) : (
                          <Circle size={20} color="#9ca3af" />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: item.done ? 'line-through' : 'none',
                            color: item.done ? 'text.secondary' : 'text.primary',
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* SECCIÓN 3: LÍNEA DE TIEMPO INTERACTIVA DEL MÉTODO TARABAN (5 FASES) */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock color="#e91e63" size={28} />
          3. Recorrido Hora por Hora (Método Taraban — 5 Fases)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Toca cada fase para ver exactamente cómo dirigir la energía de la noche desde las 6:00 p.m. hasta el regreso a dormir a casa.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {TARABAN_TIMELINE.map((phase, idx) => {
            const IconComp = phase.icon;
            const isSelected = activePhase === idx;
            return (
              <Grid xs={12} sm={6} md={2.4 as any} key={idx}>
                <Card
                  onClick={() => setActivePhase(idx)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    borderRadius: 3,
                    border: isSelected
                      ? `2px solid ${phase.color}`
                      : '1px solid rgba(150,150,150,0.2)',
                    bgcolor: isSelected ? `${phase.color}18` : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={phase.step}
                        size="small"
                        sx={{
                          bgcolor: phase.color,
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                        }}
                      />
                      <IconComp size={18} color={phase.color} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="700" display="block">
                      {phase.time}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="800" color="text.primary" sx={{ mt: 0.5, lineHeight: 1.25 }}>
                      {phase.title.split(':')[1] || phase.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* DETALLE DE LA FASE ACTIVA */}
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            border: `2px solid ${TARABAN_TIMELINE[activePhase].color}`,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Box>
                <Typography
                  variant="overline"
                   sx={{ color: TARABAN_TIMELINE[activePhase].color, fontWeight: 800, letterSpacing: 1.2 }}
                >
                  {TARABAN_TIMELINE[activePhase].step} • {TARABAN_TIMELINE[activePhase].time}
                </Typography>
                <Typography variant="h5" fontWeight="800" color="text.primary">
                  {TARABAN_TIMELINE[activePhase].title}
                </Typography>
              </Box>
              <Chip
                label={TARABAN_TIMELINE[activePhase].song}
                sx={{
                  bgcolor: `${TARABAN_TIMELINE[activePhase].color}22`,
                  color: TARABAN_TIMELINE[activePhase].color,
                  fontWeight: 700,
                }}
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, fontStyle: 'italic' }}>
              {TARABAN_TIMELINE[activePhase].summary}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {TARABAN_TIMELINE[activePhase].details.map((det, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: 'background.default',
                    borderLeft: `4px solid ${TARABAN_TIMELINE[activePhase].color}`,
                  }}
                >
                  <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {det}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* SECCIÓN 4: CHECKLIST DE LOGÍSTICA Y PREPARACIÓN DE CASA + SOUNDTRACK */}
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 4, border: '1px solid rgba(150,150,150,0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="800" color="text.primary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Moon color="#e91e63" size={24} />
                4. Checklist de Logística y Preparación de Casa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Marca cada punto conforme lo dejes listo antes del sábado:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {checklist
                  .filter((c) => c.category === 'logistica' || c.category === 'casa')
                  .map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: 'background.default',
                        border: item.done
                          ? '1px solid #22c55e'
                          : '1px solid rgba(150,150,150,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                      }}
                    >
                      {item.done ? (
                        <CheckCircle2 size={20} color="#22c55e" />
                      ) : (
                        <Circle size={20} color="#9ca3af" />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: item.done ? 'line-through' : 'none',
                          color: item.done ? 'text.secondary' : 'text.primary',
                          fontWeight: 500,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 4, border: '1px solid rgba(150,150,150,0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="800" color="text.primary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Music color="#e91e63" size={24} />
                5. Soundtrack Oficial de la Noche
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                La salsa favorita de Dei + las colaboraciones más sensuales de The Weeknd y Lana Del Rey:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {PLAYLIST_SONGS.map((s, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: 'background.default',
                      border: '1px solid rgba(150,150,150,0.18)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800" color="text.primary">
                        {s.title} — <span style={{ fontWeight: 500 }}>{s.artist}</span>
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#e91e63', fontWeight: 600 }}>
                        {s.moment}
                      </Typography>
                    </Box>
                    <IconButton
                      component="a"
                      href={s.yt}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ color: 'text.secondary', '&:hover': { color: '#e91e63' } }}
                    >
                      <ExternalLink size={16} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
