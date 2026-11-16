'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dynamic from 'next/dynamic';
import axios from 'axios';
import 'react-quill-new/dist/quill.snow.css';
import { API_URL } from '../config/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export interface PillarField {
  detalles: string;
  proximaAccion: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DatePlanStructure {
  pre: {
    mindset: string;
    planear: string;
    definicionCita: string; // Invitación, Acordar o Sorpresa
    presenciaEnLinea: string;
    atencionApoyo: string;
    chistes: string;
    cuidado: string;
    detallitos: string;
    juegosPrevios: string;
    mitigacionRiesgosChecklist: ChecklistItem[];
  };
  diaD: {
    motivo: PillarField;
    imagenMia: PillarField;
    halagosTension1: PillarField;
    inversionFemenina: PillarField;
    objeto: PillarField;
    tension2: PillarField;
    comidaBebidas: PillarField;
    inmortalizacion: PillarField;
    actividadJuego: PillarField;
    musicaBaile: PillarField;
    tension3: PillarField;
    talkSocialMedia: PillarField;
    palabrasDedicatoria: PillarField;
    socialStorytelling: PillarField;
  };
  postDay: {
    mensajeCierre: string;
    minivideoRecap: string;
    proximaAccion: string;
  };
}

export const defaultDatePlan: DatePlanStructure = {
  pre: {
    mindset: 'NO CELAR, NO EGO, NO PELEAR, NO DISCUTIR',
    planear: '',
    definicionCita: 'Sorpresa',
    presenciaEnLinea: '',
    atencionApoyo: '',
    chistes: '',
    cuidado: '',
    detallitos: '',
    juegosPrevios: '',
    mitigacionRiesgosChecklist: [
      { id: 'chk-1', text: 'Confirmar reserva / lugar / ruta y horario', done: false },
      { id: 'chk-2', text: 'Revisar clima, gasolina del auto nuevo y playlist lista', done: false },
      { id: 'chk-3', text: 'Tener listo el objeto / detalle sorpresa y efectivo/tarjeta', done: false },
    ],
  },
  diaD: {
    motivo: { detalles: '', proximaAccion: '' },
    imagenMia: { detalles: '', proximaAccion: '' },
    halagosTension1: { detalles: '', proximaAccion: '' },
    inversionFemenina: { detalles: '', proximaAccion: '' },
    objeto: { detalles: '', proximaAccion: '' },
    tension2: { detalles: '', proximaAccion: '' },
    comidaBebidas: { detalles: '', proximaAccion: '' },
    inmortalizacion: { detalles: '', proximaAccion: '' },
    actividadJuego: { detalles: '', proximaAccion: '' },
    musicaBaile: { detalles: '', proximaAccion: '' },
    tension3: { detalles: '', proximaAccion: '' },
    talkSocialMedia: { detalles: '', proximaAccion: '' },
    palabrasDedicatoria: { detalles: '', proximaAccion: '' },
    socialStorytelling: { detalles: '', proximaAccion: '' },
  },
  postDay: {
    mensajeCierre: 'Decirle lo lindo que fue compartir con ella, hacerla sentir especial',
    minivideoRecap: 'Hacer minivideo recap o enviarle nuestra mejor foto juntos',
    proximaAccion: '',
  },
};

export const defaultEvent = {
  _id: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  isAllDay: false,
  notes: '',
  media: [] as string[],
  ideaId: '',
  planType: 'fuerte',
  datePlan: JSON.parse(JSON.stringify(defaultDatePlan)) as DatePlanStructure,
};

const DIA_D_PILLARS: { key: keyof DatePlanStructure['diaD']; label: string; placeholderDetalles: string; placeholderAccion: string }[] = [
  {
    key: 'motivo',
    label: '1. MOTIVO',
    placeholderDetalles: 'Ej. Celebración 3er Mes de Novios + Estreno del Auto Nuevo en Cerro Azul',
    placeholderAccion: 'Ej. Definir concepto de la cita',
  },
  {
    key: 'imagenMia',
    label: '2. IMAGEN & PRESENTACIÓN MÍA',
    placeholderDetalles: 'Ej. Outfit elegante / casual de montaña con abrigo rico y buen perfume',
    placeholderAccion: 'Ej. Dejar ropa planchada y auto limpio',
  },
  {
    key: 'halagosTension1',
    label: '3. HALAGOS A SU BELLEZA Y TENSIÓN 1 (PIROPOS)',
    placeholderDetalles: 'Ej. "Feliz aniversario reina de mi universo. Mira qué hermosa es mi novia..." Darle vueltita y tomarla de la espalda baja',
    placeholderAccion: 'Ej. Decírselo al recogerla mirándola a los ojos',
  },
  {
    key: 'inversionFemenina',
    label: '4. INVERSIÓN FEMENINA',
    placeholderDetalles: 'Ej. Pedirle que lleve un outfit lindo y abrigo calientito / Que nos preparemos el desayuno juntos',
    placeholderAccion: 'Ej. Avisarle qué llevar sin arruinar la sorpresa',
  },
  {
    key: 'objeto',
    label: '5. OBJETO (REGALO / DETALLE FÍSICO)',
    placeholderDetalles: 'Ej. Flores boutique en el asiento del copiloto / Carta a mano / Candado',
    placeholderAccion: 'Ej. Comprar flores e imprimir fotos',
  },
  {
    key: 'tension2',
    label: '6. TENSIÓN 2 (CONTACTO & COMPLICIDAD EN CAMINO)',
    placeholderDetalles: 'Ej. Mano en su pierna mientras manejo el auto nuevo, miradas cómplices en los semáforos',
    placeholderAccion: 'Ej. Mantener energía juguetona y segura',
  },
  {
    key: 'comidaBebidas',
    label: '7. COMIDA Y BEBIDAS (PREPARAR, PEDIR O LUGAR)',
    placeholderDetalles: 'Ej. Vino tinto, quesos/pastas en la cabaña con frío de montaña + Desayuno con café en el balcón',
    placeholderAccion: 'Ej. Comprar vino y comida en el súper antes de subir',
  },
  {
    key: 'inmortalizacion',
    label: '8. INMORTALIZACIÓN (MINI SESIÓN DE FOTOS Y VIDEOS)',
    placeholderDetalles: 'Ej. Fotos estrenando el carro nuevo, brindando con vino en la cabaña y en el mirador con neblina',
    placeholderAccion: 'Ej. Tomar fotos en los mejores spots y clips para el Video Recap',
  },
  {
    key: 'actividadJuego',
    label: '9. ACTIVIDAD (JUEGO / EXPERIENCIA COMPARTIDA)',
    placeholderDetalles: 'Ej. Hacerle sus rizos (Salón VIP), ver One Piece acurrucados, pasear por el Chorro / Lago en Cerro Azul',
    placeholderAccion: 'Ej. Llevar juegos/descargar episodios',
  },
  {
    key: 'musicaBaile',
    label: '10. MÚSICA / BAILE (ESCUCHAR, CANTAR O BAILAR)',
    placeholderDetalles: 'Ej. Poner "El Incomprendido" al subir al auto, bailar abrazados lento en la cabaña',
    placeholderAccion: 'Ej. Tener playlist descargada en Spotify',
  },
  {
    key: 'tension3',
    label: '11. TENSIÓN 3 (INTIMIDAD & JUEGO DE PODER)',
    placeholderDetalles: 'Ej. Besos, caricias, "tú friita y yo calientito", noche juntos sin prisa',
    placeholderAccion: 'Ej. Ambiente cálido, velas o luz tenue',
  },
  {
    key: 'talkSocialMedia',
    label: '12. TALK & SOCIAL MEDIA',
    placeholderDetalles: 'Ej. Ver algunos videos juntos riéndonos, subir una historia linda si fluye',
    placeholderAccion: 'Ej. Guardar memes/reels para mostrarle',
  },
  {
    key: 'palabrasDedicatoria',
    label: '13. PALABRAS O DEDICATORIA (COMPROMISO)',
    placeholderDetalles: 'Ej. Dedicarle unas palabras mirándola a los ojos o leerle nota escrita a mano por los 3 meses',
    placeholderAccion: 'Ej. Escribir nota a mano en papel bonito',
  },
  {
    key: 'socialStorytelling',
    label: '14. SOCIAL & HISTORIAS (STORYTELLING / CÍRCULO)',
    placeholderDetalles: 'Ej. Hablar de cómo le fue con su familia/trabajo, anécdotas y sueños a futuro juntos',
    placeholderAccion: 'Ej. Escucharla activamente y conectar',
  },
];

function mergeDatePlan(existing: any): DatePlanStructure {
  const base = JSON.parse(JSON.stringify(defaultDatePlan)) as DatePlanStructure;
  if (!existing || typeof existing !== 'object') return base;
  return {
    pre: {
      ...base.pre,
      ...(existing.pre || {}),
      mitigacionRiesgosChecklist: Array.isArray(existing.pre?.mitigacionRiesgosChecklist)
        ? existing.pre.mitigacionRiesgosChecklist
        : base.pre.mitigacionRiesgosChecklist,
    },
    diaD: {
      ...base.diaD,
      ...(existing.diaD || {}),
    },
    postDay: {
      ...base.postDay,
      ...(existing.postDay || {}),
    },
  };
}

interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialEvent: any;
}

export default function ActivityDialog({ open, onClose, onSave, initialEvent }: ActivityDialogProps) {
  const [eventData, setEventData] = useState<any>(initialEvent || defaultEvent);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newCheckText, setNewCheckText] = useState('');

  useEffect(() => {
    const incoming = initialEvent || defaultEvent;
    setEventData({
      ...defaultEvent,
      ...incoming,
      planType: incoming.planType || 'fuerte',
      datePlan: mergeDatePlan(incoming.datePlan),
    });
    setActiveTab(0);
  }, [initialEvent, open]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${API_URL}/ideas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setIdeas(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    if (open) fetchIdeas();
  }, [open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEventData((prev: any) => ({ ...prev, media: [...prev.media, res.data.url] }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const updatePreField = (field: keyof DatePlanStructure['pre'], value: any) => {
    setEventData((prev: any) => ({
      ...prev,
      datePlan: {
        ...prev.datePlan,
        pre: {
          ...prev.datePlan.pre,
          [field]: value,
        },
      },
    }));
  };

  const updateDiaDPillar = (
    pillar: keyof DatePlanStructure['diaD'],
    subField: 'detalles' | 'proximaAccion',
    value: string,
  ) => {
    setEventData((prev: any) => ({
      ...prev,
      datePlan: {
        ...prev.datePlan,
        diaD: {
          ...prev.datePlan.diaD,
          [pillar]: {
            ...(prev.datePlan.diaD?.[pillar] || { detalles: '', proximaAccion: '' }),
            [subField]: value,
          },
        },
      },
    }));
  };

  const updatePostDayField = (field: keyof DatePlanStructure['postDay'], value: string) => {
    setEventData((prev: any) => ({
      ...prev,
      datePlan: {
        ...prev.datePlan,
        postDay: {
          ...prev.datePlan.postDay,
          [field]: value,
        },
      },
    }));
  };

  const handleToggleChecklist = (id: string) => {
    const currentList: ChecklistItem[] = eventData.datePlan?.pre?.mitigacionRiesgosChecklist || [];
    const updated = currentList.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
    updatePreField('mitigacionRiesgosChecklist', updated);
  };

  const handleAddChecklist = () => {
    if (!newCheckText.trim()) return;
    const currentList: ChecklistItem[] = eventData.datePlan?.pre?.mitigacionRiesgosChecklist || [];
    const updated = [
      ...currentList,
      { id: `chk-${Date.now()}`, text: newCheckText.trim(), done: false },
    ];
    updatePreField('mitigacionRiesgosChecklist', updated);
    setNewCheckText('');
  };

  const handleDeleteChecklist = (id: string) => {
    const currentList: ChecklistItem[] = eventData.datePlan?.pre?.mitigacionRiesgosChecklist || [];
    updatePreField(
      'mitigacionRiesgosChecklist',
      currentList.filter((item) => item.id !== id),
    );
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        startDate: new Date(eventData.startDate || new Date()),
        endDate: new Date(eventData.endDate || eventData.startDate || new Date()),
        isAllDay: eventData.isAllDay,
        notes: eventData.notes,
        media: eventData.media,
        ideaId: eventData.ideaId || null,
        planType: eventData.planType || 'fuerte',
        datePlan: eventData.datePlan,
      };

      if (eventData._id) {
        await axios.put(`${API_URL}/activities/${eventData._id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post(`${API_URL}/activities`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }

      onSave();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const dp: DatePlanStructure = eventData.datePlan || defaultDatePlan;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {eventData._id ? 'Editar Plan de Cita / Recuerdo' : 'Diseñar Nueva Cita o Fecha Especial'}
          </Typography>
          <Chip
            icon={<AutoAwesomeIcon />}
            label="Plantilla Google Sheets: PRE • DÍA D • POST DAY"
            color="secondary"
            size="small"
            variant="outlined"
          />
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="1. 📋 Datos & Diario" />
          <Tab label="2. 🛡️ PRE (Preparación & Riesgos)" />
          <Tab label="3. 🔥 DÍA D (14 Pilares de la Cita)" />
          <Tab label="4. 💌 POST DAY (Cierre & Recap)" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: '62vh' }}>
        {/* TAB 0: DATOS BÁSICOS Y DIARIO */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Tipo de Cita / Evento</InputLabel>
                  <Select
                    value={eventData.planType || 'fuerte'}
                    onChange={(e) => setEventData({ ...eventData, planType: e.target.value })}
                    label="Tipo de Cita / Evento"
                  >
                    <MenuItem value="fuerte">🔥 Cita Fuerte (Escapada, Aniversario, Noche Especial)</MenuItem>
                    <MenuItem value="suave">☕ Encuentro Suave / Ligero (Detalle, Almuerzo, Paseo)</MenuItem>
                    <MenuItem value="hito">🏆 Hito del Mapa Anual</MenuItem>
                    <MenuItem value="recuerdo">💖 Recuerdo / Historia Vivida</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Vincular a una Idea (Opcional)</InputLabel>
                  <Select
                    value={eventData.ideaId || ''}
                    onChange={(e) => setEventData({ ...eventData, ideaId: e.target.value as string })}
                    label="Vincular a una Idea (Opcional)"
                  >
                    <MenuItem value="">
                      <em>Ninguna</em>
                    </MenuItem>
                    {ideas.map((idea) => (
                      <MenuItem key={idea._id} value={idea._id}>
                        {idea.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Título (ej. 3er Mes en Cerro Azul estrenando el Auto Nuevo)"
              fullWidth
              variant="outlined"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            />
            <TextField
              label="Resumen / Concepto General"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                variant="outlined"
                label="Fecha y Hora de Inicio"
                type="datetime-local"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={eventData.startDate}
                onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
              />
              <TextField
                variant="outlined"
                label="Fecha y Hora de Fin"
                type="datetime-local"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={eventData.endDate}
                onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={eventData.isAllDay}
                  onChange={(e) => setEventData({ ...eventData, isAllDay: e.target.checked })}
                />
              }
              label="Todo el día"
            />

            <Typography variant="h6" color="primary" mt={1}>
              Diario de Recuerdos & Fotos
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Escribe tus notas, memorias o lo que pasó al estilo Notion:
              </Typography>
              <Box sx={{ height: 180, mb: 6 }}>
                <ReactQuill
                  theme="snow"
                  value={eventData.notes}
                  onChange={(val) => setEventData({ ...eventData, notes: val })}
                  style={{ height: '100%' }}
                />
              </Box>
            </Box>

            <Box>
              <Button variant="outlined" component="label" startIcon={<PhotoCamera />} disabled={uploading}>
                {uploading ? 'Subiendo...' : 'Subir Foto / Video'}
                <input type="file" hidden accept="image/*,video/*" onChange={handleFileUpload} />
              </Button>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                {eventData.media.map((url: string, i: number) => (
                  <Box key={i} position="relative">
                    <img
                      src={url}
                      alt="Recuerdo"
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                      onClick={() =>
                        setEventData((prev: any) => ({
                          ...prev,
                          media: prev.media.filter((_: any, idx: number) => idx !== i),
                        }))
                      }
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* TAB 1: PRE (PREPARACIÓN, JUEGOS PREVIOS Y MITIGACIÓN DE RIESGOS) */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'rgba(233, 30, 99, 0.1)',
                border: '1px solid rgba(233, 30, 99, 0.4)',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color="secondary" gutterBottom>
                🧘‍♂️ REGLA DE ORO MENTAL (MINDSET PRE-CITA)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={dp.pre.mindset}
                onChange={(e) => updatePreField('mindset', e.target.value)}
                placeholder="NO CELAR, NO EGO, NO PELEAR, NO DISCUTIR"
              />
            </Paper>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Definición de Cita (Invitación, Acordar o Sorpresa)</InputLabel>
                  <Select
                    value={dp.pre.definicionCita || 'Sorpresa'}
                    label="Definición de Cita (Invitación, Acordar o Sorpresa)"
                    onChange={(e) => updatePreField('definicionCita', e.target.value)}
                  >
                    <MenuItem value="Sorpresa">🎁 Sorpresa (Solo decirle qué empacar/vestir y a qué hora paso)</MenuItem>
                    <MenuItem value="Invitación">💌 Invitación Directa (Propuesta clara con hora y lugar)</MenuItem>
                    <MenuItem value="Acordar">🤝 Acordar Juntos (Elegir entre 2 opciones)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="PLANEAR (Logística general previa)"
                  fullWidth
                  size="small"
                  value={dp.pre.planear}
                  onChange={(e) => updatePreField('planear', e.target.value)}
                  placeholder="Ej. Separar cabaña en Cerro Azul para el martes en la noche, comprar vino..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="PRESENCIA EN LÍNEA (Redes Sociales previas)"
                  fullWidth
                  size="small"
                  value={dp.pre.presenciaEnLinea}
                  onChange={(e) => updatePreField('presenciaEnLinea', e.target.value)}
                  placeholder="Ej. Comentarle linda su historia, enviarle un reel que dé pista..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="ATENCIÓN & APOYO (Días previos)"
                  fullWidth
                  size="small"
                  value={dp.pre.atencionApoyo}
                  onChange={(e) => updatePreField('atencionApoyo', e.target.value)}
                  placeholder="Ej. Preguntarle cómo va su turno, escucharla y darle paz..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="CHISTES & HUMOR"
                  fullWidth
                  size="small"
                  value={dp.pre.chistes}
                  onChange={(e) => updatePreField('chistes', e.target.value)}
                  placeholder="Ej. Bromas internas ("tú friita y yo calientito"), hacerla reír..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="CUIDADO (Caballerosidad y protección)"
                  fullWidth
                  size="small"
                  value={dp.pre.cuidado}
                  onChange={(e) => updatePreField('cuidado', e.target.value)}
                  placeholder="Ej. Asegurar abrigo extra para el frío de Cerro Azul, abrirle la puerta del auto nuevo..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="DETALLITOS PREVIOS"
                  fullWidth
                  size="small"
                  value={dp.pre.detallitos}
                  onChange={(e) => updatePreField('detallitos', e.target.value)}
                  placeholder="Ej. Heladito naranja-piña o snack favorito en la guantera del carro..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="JUEGOS PREVIOS (Crear anticipación / misterio)"
                  fullWidth
                  size="small"
                  value={dp.pre.juegosPrevios}
                  onChange={(e) => updatePreField('juegosPrevios', e.target.value)}
                  placeholder="Ej. Decirle el lunes: 'Prepara un abrigo rico para mañana en la noche, te voy a robar en el carro nuevo'..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                ✅ PREPARACIÓN, MITIGACIÓN DE RIESGOS Y CONFIRMACIÓN
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Agregar paso de preparación o mitigación de riesgo..."
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklist();
                    }
                  }}
                />
                <Button variant="contained" onClick={handleAddChecklist} startIcon={<AddCircleOutlineIcon />}>
                  Añadir
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {(dp.pre.mitigacionRiesgosChecklist || []).map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{ px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(item.done)}
                          onChange={() => handleToggleChecklist(item.id)}
                          color="success"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.65 : 1 }}
                        >
                          {item.text}
                        </Typography>
                      }
                      sx={{ flex: 1 }}
                    />
                    <IconButton size="small" onClick={() => handleDeleteChecklist(item.id)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* TAB 2: DÍA D (LOS 14 PILARES DEL GOOGLE SHEET) */}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Diseña cada pilar de tu tabla <strong>DÍA D</strong> con sus <strong>Detalles</strong> y su{' '}
              <strong>Próxima Acción</strong> ejecutable:
            </Typography>

            {DIA_D_PILLARS.map((p) => {
              const val = dp.diaD?.[p.key] || { detalles: '', proximaAccion: '' };
              return (
                <Paper
                  key={p.key}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, borderColor: val.detalles ? 'rgba(233, 30, 99, 0.45)' : 'divider' }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    {p.label}
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <TextField
                        label="Detalles"
                        fullWidth
                        size="small"
                        multiline
                        minRows={1}
                        value={val.detalles}
                        onChange={(e) => updateDiaDPillar(p.key, 'detalles', e.target.value)}
                        placeholder={p.placeholderDetalles}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextField
                        label="Próxima Acción"
                        fullWidth
                        size="small"
                        value={val.proximaAccion}
                        onChange={(e) => updateDiaDPillar(p.key, 'proximaAccion', e.target.value)}
                        placeholder={p.placeholderAccion}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        )}

        {/* TAB 3: POST DAY */}
        {activeTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                💌 POST DAY — Sellar la Memoria Emocional
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Mensaje / Palabras de Cierre (Al día siguiente)"
                  fullWidth
                  multiline
                  rows={2}
                  value={dp.postDay?.mensajeCierre || ''}
                  onChange={(e) => updatePostDayField('mensajeCierre', e.target.value)}
                  placeholder="Decirle lo lindo que fue compartir con ella en mi lugar / estrenar el carro juntos..."
                />
                <TextField
                  label="Minivideo Recap / Recuerdo Multimedia"
                  fullWidth
                  multiline
                  rows={2}
                  value={dp.postDay?.minivideoRecap || ''}
                  onChange={(e) => updatePostDayField('minivideoRecap', e.target.value)}
                  placeholder="Hacer minivideo recap con música (ej. Young & Beautiful) y subir las mejores fotos a Lovesa..."
                />
                <TextField
                  label="Próxima Acción Post-Cita"
                  fullWidth
                  value={dp.postDay?.proximaAccion || ''}
                  onChange={(e) => updatePostDayField('proximaAccion', e.target.value)}
                  placeholder="Ej. Editar reel recap el jueves y planear la cita suave del fin de semana"
                />
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveClick}>
          Guardar Plan / Actividad
        </Button>
      </DialogActions>
    </Dialog>
  );
}

