'use client';
import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CoffeeIcon from '@mui/icons-material/Coffee';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { API_URL } from '../../config/api';

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

interface SheetPillarRow {
  id: string;
  pilar: string;
  detalles: string;
  proximaAccion: string;
}

interface SheetPreState {
  mindset: string;
  planear: string;
  definicionCita: string;
  presenciaEnLinea: string;
  atencionApoyo: string;
  chistes: string;
  cuidado: string;
  detallitos: string;
  juegosPrevios: string;
  checklist: { id: string; text: string; done: boolean }[];
}

const INITIAL_CERRO_AZUL_PRE: SheetPreState = {
  mindset: 'NO CELAR, NO EGO, NO PELEAR, NO DISCUTIR',
  planear: 'Separar cabañita/Airbnb en Altos de Cerro Azul para el martes 17 en la noche ($45–$60) y comprar vino + cena/desayuno en el súper ($20–$25).',
  definicionCita: 'Sorpresa (Avisarle que empaque ropa cómoda y un abrigo calientito para el martes en la noche porque nos vamos a estrenar el auto nuevo por nuestro 3er mes).',
  presenciaEnLinea: 'Subir o enviarle algo lindo por nuestro 3er mes (15 de noviembre) y mantener tensión bonita por WhatsApp.',
  atencionApoyo: 'Estar pendiente de su turno de inicio de semana, apoyarla y transmitirle tranquilidad total.',
  chistes: 'Molestarla con cariño con nuestro clásico: "Allá arriba hace frío, así que tú friita y yo calientito ❄️🔥".',
  cuidado: 'Abrirle la puerta del auto nuevo, llevarle un abrigo extra por si le da frío en la montaña y manejar suave y seguro.',
  detallitos: 'Tener su heladito de naranja-piña o snack favorito y una flor en el asiento del copiloto cuando suba al carro nuevo.',
  juegosPrevios: 'Decirle desde el lunes: "Mañana martes en la noche eres mía, ten lista una mudada y abrigo que vamos a bautizar la nave nueva 🚗✨".',
  checklist: [
    { id: 'ca-1', text: 'Reservar cabaña/Airbnb en Cerro Azul con llegada autónoma o check-in nocturno (Martes 17 a Miércoles 18 Nov)', done: false },
    { id: 'ca-2', text: 'Tanquear el auto nuevo ($10-$15 bastan ida y vuelta) y revisar llantas/luces para subir la montaña', done: false },
    { id: 'ca-3', text: 'Comprar en el súper antes de subir: Vino tinto/sangría ($10), pastas o tabla de quesos/jamón ($10), huevos/pan/café para desayuno ($6)', done: false },
    { id: 'ca-4', text: 'Comprar flor/rosas de 3er mes + escribirle la nota/dedicatoria a mano', done: false },
    { id: 'ca-5', text: 'Descargar playlist en el celular (por si falla la señal en la subida) y capítulos de One Piece', done: false },
  ],
};

const INITIAL_CERRO_AZUL_DIA_D: SheetPillarRow[] = [
  {
    id: 'motivo',
    pilar: 'MOTIVO',
    detalles: 'Celebración 3er Mes de Novios (15 Nov) + Bautizo del Auto Nuevo en Cerro Azul (Martes noche a Miércoles libre)',
    proximaAccion: 'Confirmar hora en que sale Dei el martes para pasar por ella',
  },
  {
    id: 'imagenMia',
    pilar: 'IMAGEN & PRESENTACIÓN MÍA',
    detalles: 'Outfit casual elegante de montaña (suéter/abrigo que me quede brutal), corte fresco, buen perfume y el auto nuevo impecable y oliendo rico',
    proximaAccion: 'Alistar mi ropa y limpiar el interior del carro el martes en la tarde',
  },
  {
    id: 'halagosTension1',
    pilar: 'HALAGOS A SU BELLEZA Y TENSIÓN 1 (PIROPOS)',
    detalles: '"Feliz 3er mes reina de mi universo. Mira qué hermosa se ve mi novia estrenando el asiento de copiloto". Darle vueltita, tomarla de la espalda baja y beso lento',
    proximaAccion: 'Recibirla afuera del carro y abrirle la puerta del copiloto',
  },
  {
    id: 'inversionFemenina',
    pilar: 'INVERSIÓN FEMENINA',
    detalles: 'Que ella aliste su bolsito con abrigo lindo y que en la cabaña me ayude a preparar el desayuno o elegir la música del viaje',
    proximaAccion: 'Recordarle el lunes que empaque abrigo calientito y ropa cómoda',
  },
  {
    id: 'objeto',
    pilar: 'OBJETO',
    detalles: 'Flores boutique en el asiento del copiloto + Nota de 3er mes escrita a mano',
    proximaAccion: 'Comprar flores el martes y dejarlas en el asiento antes de recogerla',
  },
  {
    id: 'tension2',
    pilar: 'TENSIÓN 2',
    detalles: 'Mano en su pierna mientras subimos a Cerro Azul en el carro nuevo, miradas cómplices y apagar el aire cuando empiece el frío de la montaña',
    proximaAccion: 'Bajar un poquito los vidrios al llegar a los pinos para sentir el aire frío',
  },
  {
    id: 'comidaBebidas',
    pilar: 'COMIDA Y BEBIDAS (PREPARAR, PEDIR O IR A UN LUGAR)',
    detalles: 'Martes noche: Cena íntima en la cabaña (pastas o picada de quesos/jamón + copa de vino/chocolate caliente). Miércoles mañana: Desayuno juntos con café viendo la neblina',
    proximaAccion: 'Pasar al supermercado antes de subir a las 7:00-8:00 p.m.',
  },
  {
    id: 'inmortalizacion',
    pilar: 'INMORTALIZACIÓN (MINI SESIÓN DE FOTOS Y VIDEOS JUNTOS)',
    detalles: 'Foto de los dos estrenando el auto nuevo, brindando con vino en la cabaña de noche, y el miércoles por la mañana en el mirador / Chorro El Vigía con neblina',
    proximaAccion: 'Grabar clips cortos de 3-5 seg para armar el Video Recap del 3er mes',
  },
  {
    id: 'actividadJuego',
    pilar: 'ACTIVIDAD (JUEGO)',
    detalles: 'Miércoles en la mañana: "Salón VIP" consintiéndola y definiéndole sus rizos con calma en la cabaña + Paseo en el auto nuevo al Chorro El Vigía / Lago Goofy',
    proximaAccion: 'Llevar sus cremitas o pedirle que lleve lo de sus rizos',
  },
  {
    id: 'musicaBaile',
    pilar: 'MÚSICA / BAILE (DISFRUTAR DE MÚSICA Y BAILAR O CANTAR)',
    detalles: 'Poner "El Incomprendido" (Ismael Rivera) apenas se monte al auto nuevo, cantar juntos en la carretera y bailar una canción abrazaditos lento en la cabaña',
    proximaAccion: 'Tener lista la cola de reproducción en Spotify',
  },
  {
    id: 'tension3',
    pilar: 'TENSIÓN 3',
    detalles: 'Besos, caricias, juego de poder bajo las sábanas con el frío rico de Cerro Azul ("Tú friita y yo calientito" 🔥❄️)',
    proximaAccion: 'Poner luz tenue y música sensual en la cabaña',
  },
  {
    id: 'talkSocialMedia',
    pilar: 'TALK & SOCIAL MEDIA',
    detalles: 'Ver un episodio de One Piece o videos graciosos acurrucaditos en la cama con snacks',
    proximaAccion: 'Tener listo el iPad/celular o TV de la cabaña',
  },
  {
    id: 'palabrasDedicatoria',
    pilar: 'PALABRAS O DEDICATORIA (PALABRAS LINDAS DE COMPROMISO)',
    detalles: 'Entregarle y leerle sin prisa la carta escrita a mano por nuestros 3 meses juntos, agradeciéndole su amor incondicional y celebrando este nuevo logro del carro juntos',
    proximaAccion: 'Escribir la carta a mano en papel bonito y tomarle foto para el álbum',
  },
  {
    id: 'socialStorytelling',
    pilar: 'SOCIAL & HISTORIAS (STORYTELLING)',
    detalles: 'Conversar con café en mano sobre cómo nos hemos sentido estos 3 meses, su familia, mi familia y todos los viajes que haremos ahora en el carro nuevo',
    proximaAccion: 'Editar el minivideo recap al regresar',
  },
];

const INITIAL_CERRO_AZUL_POST = {
  mensajeCierre: 'Decirle lo mágico que fue estrenar el carro nuevo con ella en la montaña y despertar juntos en nuestro 3er mes.',
  minivideoRecap: 'Armar el minivideo recap del viaje a Cerro Azul (con música como "Young & Beautiful" o nuestra canción) y guardarlo en Nuestra Historia.',
};

export default function ExperienciasPlanner() {
  const [value, setValue] = useState(0);
  const [preState, setPreState] = useState<SheetPreState>(INITIAL_CERRO_AZUL_PRE);
  const [diaDRows, setDiaDRows] = useState<SheetPillarRow[]>(INITIAL_CERRO_AZUL_DIA_D);
  const [postState, setPostState] = useState(INITIAL_CERRO_AZUL_POST);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [savingToCalendar, setSavingToCalendar] = useState(false);

  useEffect(() => {
    try {
      const savedPre = localStorage.getItem('lovesa_sheet_pre_v1');
      const savedDiaD = localStorage.getItem('lovesa_sheet_diad_v1');
      const savedPost = localStorage.getItem('lovesa_sheet_post_v1');
      if (savedPre) setPreState(JSON.parse(savedPre));
      if (savedDiaD) setDiaDRows(JSON.parse(savedDiaD));
      if (savedPost) setPostState(JSON.parse(savedPost));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveLocalSheet = (nextPre = preState, nextDiaD = diaDRows, nextPost = postState) => {
    try {
      localStorage.setItem('lovesa_sheet_pre_v1', JSON.stringify(nextPre));
      localStorage.setItem('lovesa_sheet_diad_v1', JSON.stringify(nextDiaD));
      localStorage.setItem('lovesa_sheet_post_v1', JSON.stringify(nextPost));
      setSavedMsg('Cambios guardados automáticamente en tu matriz de planeación ✅');
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePreCheck = (id: string) => {
    const next = {
      ...preState,
      checklist: preState.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    };
    setPreState(next);
    saveLocalSheet(next, diaDRows, postState);
  };

  const handleDiaDChange = (id: string, field: 'detalles' | 'proximaAccion', val: string) => {
    const next = diaDRows.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    setDiaDRows(next);
    localStorage.setItem('lovesa_sheet_diad_v1', JSON.stringify(next));
  };

  const handleSyncCerroAzulToCalendar = async () => {
    setSavingToCalendar(true);
    try {
      const diaDObj: any = {};
      diaDRows.forEach((r) => {
        diaDObj[r.id] = { detalles: r.detalles, proximaAccion: r.proximaAccion };
      });

      const payload = {
        title: '🚗⛰️ Escapada 3er Mes a Cerro Azul (Estreno Auto Nuevo)',
        description:
          'Cita Fuerte de 3er Aniversario (Martes 17 noche al Miércoles 18 de Noviembre): Subida a cabaña en Cerro Azul en el carro nuevo, noche de vino y frío ("Tú friita y yo calientito"), desayuno con neblina, Salón VIP (rizos) y paseo al Chorro El Vigía.',
        startDate: new Date('2026-11-17T20:00:00-05:00'),
        endDate: new Date('2026-11-18T17:00:00-05:00'),
        isAllDay: false,
        planType: 'fuerte',
        notes: `<p><strong>Presupuesto Inteligente ($75–$95 total):</strong> Cabaña Airbnb ($45–$60) + Supermercado vino/cena/desayuno ($20–$25) + Gasolina ($10).</p><p><strong>POST DAY:</strong> ${postState.mensajeCierre} | ${postState.minivideoRecap}</p>`,
        media: [],
        datePlan: {
          pre: {
            mindset: preState.mindset,
            planear: preState.planear,
            definicionCita: preState.definicionCita,
            presenciaEnLinea: preState.presenciaEnLinea,
            atencionApoyo: preState.atencionApoyo,
            chistes: preState.chistes,
            cuidado: preState.cuidado,
            detallitos: preState.detallitos,
            juegosPrevios: preState.juegosPrevios,
            mitigacionRiesgosChecklist: preState.checklist,
          },
          diaD: diaDObj,
          postDay: {
            mensajeCierre: postState.mensajeCierre,
            minivideoRecap: postState.minivideoRecap,
            proximaAccion: 'Editar video recap',
          },
        },
      };

      await axios.post(`${API_URL}/activities`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSavedMsg('🎉 ¡Plan de Cerro Azul guardado en el Calendario y en Nuestra Historia con todos los 14 pilares!');
      window.dispatchEvent(new Event('lovesa:data-updated'));
    } catch (e) {
      console.error(e);
      setSavedMsg('Guardado localmente. (Inicia sesión si deseas sincronizarlo al servidor).');
    } finally {
      setSavingToCalendar(false);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const noviembreSemanas = [
    {
      semana: 'Semana 1 – 2 (1 – 14 Nov)',
      estado: 'Completada ✅',
      citaFuerte: 'Post-Halloween The Weeknd & Lana Del Rey + Preparación y estreno del Auto Nuevo 🚗✨',
      encuentroLigero: 'Almuerzos y cenas consentidas en el turno + Paseos nocturnos juntos 🌙',
    },
    {
      semana: 'Semana 3 (15 – 21 Nov) • SEMANA ACTUAL 🔥',
      estado: 'En Curso ⛰️🚗',
      citaFuerte:
        'MARTES 17 (NOCHE) A MIÉRCOLES 18 (DÍA LIBRE): Escapada de 3er Mes de Aniversario a Cerro Azul en el Auto Nuevo — Cabaña con frío de montaña, vino, cena íntima, Salón VIP (hacerle sus rizos) y mirador ($75–$95 total) 🍷🌲❄️',
      encuentroLigero:
        'LUNES / VIERNES (CITA SUAVE): Pasar por ella al salir del turno en el carro nuevo con su heladito de naranja-piña (o pancitos de Mr. Bono) + nota y flor de 3er mes 🍦💐',
    },
    {
      semana: 'Semana 4 (22 – 30 Nov)',
      estado: 'Próxima Semana 📅',
      citaFuerte:
        'Salir a bailar música latina en grupo o en pareja ("El Incomprendido") / Desayuno o Cena en Restaurante Coreano y tomar té 💃🍵',
      encuentroLigero: 'Tarde de lluvia viendo One Piece acurrucados o armar figuritas en casa 🌧️🍿',
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
      estado: 'Completada 🎃',
      citaFuerte: 'SÁBADO 31 DE OCTUBRE: Halloween "The Weeknd & Lana Del Rey" — Cena + Fiesta en Rooftop de Casco Antiguo y regreso a dormir juntos a casa 🕶️🌹🍷',
      encuentroLigero: 'Armar y probarnos los outfits de The Weeknd y Lana Del Rey ✨',
    },
  ];

  const anual = [
    { mes: 'Agosto 2026 (15/08)', evento: 'Inicio de Noviazgo + Mr. Bono y El Dorado', icono: '✅' },
    { mes: 'Septiembre 2026 (15/09)', evento: '1er Mes: Flores Boutique, Canción Original a mano y Cena con vista', icono: '💐' },
    { mes: 'Septiembre 2026 (21/09 y 24/09)', evento: 'Flores Amarillas (21/09) + Almuerzo Cumpleaños (24/09)', icono: '🌻' },
    { mes: 'Octubre 2026 (15/10 y 20/10)', evento: '2do Mes Aniversario (Candado en Amador / Cena) + Primera visita a APLAFA', icono: '🔒' },
    { mes: 'Octubre 2026 (27/10 y 31/10)', evento: 'Concierto Nelson Velázquez / Bailar + Fiesta de Halloween (The Weeknd & Lana)', icono: '🎃' },
    { mes: 'Noviembre 2026 (17-18/11)', evento: '3er Mes: Escapada a Cerro Azul estrenando el Auto Nuevo + 1er Video Recap (Young & Beautiful)', icono: '🚗' },
    { mes: 'Noviembre 2026 (Finales)', evento: 'Comprar ropa combinada en pareja + Salir a bailar / Día de Pesca', icono: '👕' },
    { mes: 'Diciembre 2026 (15/12)', evento: '4to Mes / Trimestral: Regalo de Flores + Ver película de Dinosaurio juntos', icono: '🦕' },
    { mes: 'Diciembre 2026 (24-25/12)', evento: 'Plan de Navidad en Casa — "La Navidad Más Linda"', icono: '🎄' },
    { mes: 'Enero 2027 (29/01)', evento: 'Tirarse de un Avión en Paracaídas + Cenar en Casco y Hotel Boutique', icono: '🪂' },
    { mes: 'Marzo 2027 (15/03)', evento: 'Regalo de Flores Trimestral + Avistamiento de Ballenas (Temporada)', icono: '🐋' },
  ];

  const inboxElla = [
    'Tour de avistamiento de ballenas',
    'Plan Artístico de Moldeado de Arcilla',
    'Desayuno en restaurante Koreano y tomar té',
    'Día de Playa / Día de Pesca',
    'Día de Casa: Tú le cocinas, ella disfruta',
    'Salir a Bailar Música Latina (en pareja o en grupo)',
    'Ir a la Iglesia juntos',
    'Enseñanza de Skateboard',
    'Ver película de Dinosaurio juntos',
  ];

  const inboxJeff = [
    'Escapada a Cerro Azul estrenando el Auto Nuevo (Martes 17 a Miércoles 18 Nov)',
    'Candado en Amador + 1er Video Recap (Young & Beautiful)',
    'Comprar ropa combinada en pareja',
    'Tour en Tren Interoceánico',
    'Cita Romántica a Solas, Flores, Serenata',
    'Concierto de Romeo / Nelson Velázquez',
    'Dedicatoria Sorpresa en Bar con Música en Vivo',
    'Día de Casa (Salón VIP): Rizos y comida + Armar figuritas en casa',
    'Correr en carritos de playa (Buggies)',
  ];

  const wishlistRegalos = [
    'Flor + Carta a mano en el asiento del copiloto del Auto Nuevo (Martes 17 Nov)',
    '1er Video Recap editado con "Young & Beautiful"',
    'Ropa combinada en pareja',
    'Escapada de día lluvioso viendo películas y One Piece acurrucados',
    'Tocarle una canción en el acordeón',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
            Arquitectura de Experiencias
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Director: Jeffreey | Sistema Google Sheets (PRE • DÍA D • POST DAY) & Método Taraban
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          disabled={savingToCalendar}
          onClick={handleSyncCerroAzulToCalendar}
          sx={{ fontWeight: 'bold', borderRadius: 2 }}
        >
          {savingToCalendar ? 'Guardando...' : 'Agendar Plan Cerro Azul en Calendario'}
        </Button>
      </Box>

      {savedMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSavedMsg(null)}>
          {savedMsg}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="🚗⛰️ Plan 3er Mes: Cerro Azul (Matriz PRE • DÍA D • POST)" />
          <Tab label="📅 Semanas Noviembre & Octubre (Fuerte + Suave)" />
          <Tab label="🗺️ Mapa Anual (Del Sheet)" />
          <Tab label="📥 Inbox & Wishlist" />
        </Tabs>
      </Box>

      {/* TAB 0: MATRIZ GOOGLE SHEETS APLICADA AL PLAN DE CERRO AZUL (MARTES NOCHE -> MIÉRCOLES) */}
      <CustomTabPanel value={value} index={0}>
        {/* RESUMEN EJECUTIVO Y PRESUPUESTO */}
        <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(233, 30, 99, 0.1)', border: '1px solid rgba(233, 30, 99, 0.35)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarIcon fontSize="large" sx={{ color: '#e91e63' }} /> Escapada 3er Mes: Cerro Azul en el Auto Nuevo
            </Typography>
            <Chip label="Presupuesto Low-Cost VIP: $75 – $95 USD Total" sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 'bold' }} />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Cuándo:</strong> Salida Martes 17 de Noviembre en la noche (después del turno) ➔ Regreso Miércoles 18 de Noviembre en la tarde (Día Libre).
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  🏡 1. Hospedaje ($45 – $60 USD)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cabaña o estudio en Airbnb en <strong>Altos de Cerro Azul</strong> (a solo 45 min de la ciudad). Al ser martes en la noche tiene tarifa económica entre semana y clima frío de montaña (18°C–20°C).
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  🍷 2. Cena + Desayuno de Súper ($20 – $25 USD)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En vez de gastar $70 en restaurante, compran antes de subir: <strong>vino tinto/sangría ($9), quesos/jamón o pasta ($10) y desayuno para hacer juntos en la cabaña ($6)</strong>.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  ⛽ 3. Gasolina Auto Nuevo + Paseo ($10 – $12 USD)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cerro Azul queda cerquita. El miércoles pasean en el carro nuevo por el <strong>Mirador, Lago Goofy y el Chorro El Vigía</strong> antes de bajar.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* BLOQUE 1 DE TU GOOGLE SHEET: PRE */}
        <Card elevation={3} sx={{ mb: 4, borderRadius: 3, border: '1px solid #444' }}>
          <Box sx={{ bgcolor: '#1e293b', px: 3, py: 2, borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
              🛡️ FASE 1: PRE (Actitud, Juegos Previos & Mitigación de Riesgos)
            </Typography>
            <Chip label={preState.mindset} color="error" size="small" sx={{ fontWeight: 'bold' }} />
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { key: 'planear', label: 'PLANEAR' },
                { key: 'definicionCita', label: 'DEFINICIÓN DE CITA (INVITACIÓN, ACORDAR O SORPRESA)' },
                { key: 'presenciaEnLinea', label: 'PRESENCIA EN LÍNEA (REDES SOCIALES)' },
                { key: 'atencionApoyo', label: 'ATENCIÓN & APOYO' },
                { key: 'chistes', label: 'CHISTES' },
                { key: 'cuidado', label: 'CUIDADO' },
                { key: 'detallitos', label: 'DETALLITOS' },
                { key: 'juegosPrevios', label: 'JUEGOS PREVIOS' },
              ].map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.key}>
                  <TextField
                    label={item.label}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    value={(preState as any)[item.key] || ''}
                    onChange={(e) => {
                      const next = { ...preState, [item.key]: e.target.value };
                      setPreState(next);
                      localStorage.setItem('lovesa_sheet_pre_v1', JSON.stringify(next));
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 1.5 }}>
              ☑️ PREPARACIÓN, MITIGACIÓN DE RIESGOS Y CONFIRMACIÓN (Checklist Pre-Viaje)
            </Typography>
            <Grid container spacing={1}>
              {preState.checklist.map((item) => (
                <Grid size={{ xs: 12 }} key={item.id}>
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: item.done ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      borderColor: item.done ? '#10b981' : 'divider',
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox checked={item.done} onChange={() => handleTogglePreCheck(item.id)} color="success" />}
                      label={
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.7 : 1 }}
                        >
                          {item.text}
                        </Typography>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* BLOQUE 2 DE TU GOOGLE SHEET: TABLA DÍA D (14 PILARES) */}
        <Card elevation={3} sx={{ mb: 4, borderRadius: 3, border: '1px solid #444' }}>
          <Box sx={{ bgcolor: '#881337', px: 3, py: 2, borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
              🔥 FASE 2: DÍA D — Tabla Maestra de los 14 Pilares (Editable en Vivo)
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              Cualquier cambio que escribas aquí se guarda automáticamente
            </Typography>
          </Box>
          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(233, 30, 99, 0.15)' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '26%' }}>Pilar (Tu Google Sheet)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '46%' }}>Detalles (Plan Cerro Azul 3er Mes)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '28%' }}>Próxima Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diaDRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', verticalAlign: 'top', pt: 2 }}>
                      {row.pilar}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top', py: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        value={row.detalles}
                        onChange={(e) => handleDiaDChange(row.id, 'detalles', e.target.value)}
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top', py: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        value={row.proximaAccion}
                        onChange={(e) => handleDiaDChange(row.id, 'proximaAccion', e.target.value)}
                        sx={{ fontStyle: 'italic' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* BLOQUE 3 DE TU GOOGLE SHEET: POST DAY */}
        <Card elevation={3} sx={{ borderRadius: 3, border: '1px solid #444' }}>
          <Box sx={{ bgcolor: '#065f46', px: 3, py: 2, borderBottom: '1px solid #444' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
              💌 FASE 3: POST DAY (Cierre Emocional & Minivideo Recap)
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Palabras Post-Cita (Jueves por la mañana)"
                  fullWidth
                  multiline
                  rows={2}
                  value={postState.mensajeCierre}
                  onChange={(e) => {
                    const next = { ...postState, mensajeCierre: e.target.value };
                    setPostState(next);
                    saveLocalSheet(preState, diaDRows, next);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Minivideo Recap & Álbum"
                  fullWidth
                  multiline
                  rows={2}
                  value={postState.minivideoRecap}
                  onChange={(e) => {
                    const next = { ...postState, minivideoRecap: e.target.value };
                    setPostState(next);
                    saveLocalSheet(preState, diaDRows, next);
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </CustomTabPanel>

      {/* TAB 1: LOGÍSTICA SEMANAL NOVIEMBRE & OCTUBRE (CITA FUERTE + CITA SUAVE) */}
      <CustomTabPanel value={value} index={1}>
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          🔥 Noviembre 2026: Citas Fuertes & Encuentros Suaves
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {noviembreSemanas.map((item, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card elevation={3} sx={{ borderRadius: 3, border: idx === 1 ? '2px solid #e91e63' : '1px solid #333', height: '100%' }}>
                <Box sx={{ bgcolor: idx === 1 ? 'rgba(233, 30, 99, 0.2)' : '#333', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                    {item.semana}
                  </Typography>
                  <Chip
                    label={item.estado}
                    size="small"
                    color={idx === 1 ? 'secondary' : 'success'}
                    variant="outlined"
                  />
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalBarIcon fontSize="small" sx={{ color: '#e91e63' }} /> CITA FUERTE
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.citaFuerte}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CoffeeIcon fontSize="small" /> CITA SUAVE (ENCUENTRO LIGERO)
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

        <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
          ✅ Historial Octubre 2026 (Completado)
        </Typography>
        <Grid container spacing={3}>
          {octubreSemanas.map((item, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #333', height: '100%' }}>
                <Box sx={{ bgcolor: '#333', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {item.semana}
                  </Typography>
                  <Chip label={item.estado} size="small" color="success" variant="outlined" />
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalBarIcon fontSize="small" sx={{ color: '#e91e63' }} /> CITA FUERTE
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.citaFuerte}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #444' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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

      {/* TAB 2: MAPA ANUAL ACTUALIZADO CON LAS CAPTURAS DEL GOOGLE SHEET */}
      <CustomTabPanel value={value} index={2}>
        <Grid container spacing={2}>
          {anual.map((hito, i) => (
            <Grid size={{ xs: 12 }} key={i}>
              <Card elevation={1} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, border: '1px solid #333' }}>
                <Box sx={{ fontSize: 30, mr: 3 }}>{hito.icono}</Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                    {hito.mes}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {hito.evento}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      {/* TAB 3: INBOX */}
      <CustomTabPanel value={value} index={3}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                  🎁 WISHLIST & PRÓXIMOS DETALLES
                </Typography>
              </Box>
              <List>
                {wishlistRegalos.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText primary={item} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                  💖 IDEAS DE DEI
                </Typography>
              </Box>
              <List>
                {inboxElla.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText primary={item} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ height: '100%', border: '1px solid #333' }}>
              <Box sx={{ bgcolor: '#333', p: 2, borderBottom: '1px solid #444' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                  👑 IDEAS DE JEFF (DEL GOOGLE SHEET)
                </Typography>
              </Box>
              <List>
                {inboxJeff.map((item, i) => (
                  <ListItem key={i} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
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

