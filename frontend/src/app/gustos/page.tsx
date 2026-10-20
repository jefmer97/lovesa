'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Heart, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../config/api';

interface PreferenceItem {
  _id: string;
  title: string;
  category: string;
  notes: string;
}

const CATEGORIES = [
  { value: 'todos', label: '✨ Todos', color: '#e91e63' },
  { value: 'musica', label: '🎵 Música y Canciones', color: '#ec4899' },
  { value: 'comida', label: '🍣 Comida y Antojos', color: '#f59e0b' },
  { value: 'regalos', label: '💐 Flores y Regalos', color: '#a855f7' },
  { value: 'hobbies', label: '🎨 Hobbies y Series', color: '#3b82f6' },
  { value: 'detalles', label: '🥰 Detalles que la Enamoran', color: '#10b981' },
  { value: 'evitar', label: '⚠️ Evitar / No le gusta', color: '#ef4444' },
];

export default function GustosDeDeiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [selectedTab, setSelectedTab] = useState('todos');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('musica');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPreferences = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/preferences`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (e) {
      console.error('Error fetching preferences:', e);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchPreferences();
    }
    const handleRefresh = () => {
      if (user) fetchPreferences();
    };
    window.addEventListener('lovesa:data-updated', handleRefresh);
    return () => window.removeEventListener('lovesa:data-updated', handleRefresh);
  }, [user, loading, router, fetchPreferences]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          notes: notes.trim(),
        }),
      });
      if (res.ok) {
        setTitle('');
        setNotes('');
        fetchPreferences();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/preferences/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchPreferences();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) return null;

  const filteredPreferences =
    selectedTab === 'todos'
      ? preferences
      : preferences.filter((p) => p.category === selectedTab);

  const getCategoryMeta = (catValue: string) =>
    CATEGORIES.find((c) => c.value === catValue) || {
      value: catValue,
      label: '💖 Gusto',
      color: '#e91e63',
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Heart color="#e91e63" fill="#e91e63" size={36} />
          Gustos y Favoritos de Dei
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Su música, antojos, canciones favoritas, flores, hobbies y cada detalle que la enamora.
        </Typography>
      </Box>

      {/* Formulario rápido para agregar un gusto */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid rgba(233, 30, 99, 0.3)' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlusCircle color="#e91e63" size={20} />
          Guardar nuevo gusto o preferencia de Dei
        </Typography>
        <Box component="form" onSubmit={handleAdd}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="¿Qué le gusta? (Ej. Canción, plato, perfume...)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c.value !== 'todos').map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Notas o cómo sorprenderla (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting || !title.trim()}
                sx={{
                  bgcolor: '#e91e63',
                  color: '#fff',
                  '&:hover': { bgcolor: '#c2185b' },
                }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Pestañas de filtro por categoría */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newVal) => setSelectedTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {CATEGORIES.map((cat) => (
            <Tab key={cat.value} value={cat.value} label={cat.label} />
          ))}
        </Tabs>
      </Box>

      {/* Tarjetas de gustos */}
      <Grid container spacing={2.5}>
        {filteredPreferences.map((pref) => {
          const meta = getCategoryMeta(pref.category);
          return (
            <Grid xs={12} sm={6} md={4} key={pref._id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Chip
                      label={meta.label}
                      size="small"
                      sx={{
                        bgcolor: `${meta.color}22`,
                        color: meta.color,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(pref._id)}
                      sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 1, fontSize: '1.05rem' }}>
                    {pref.title}
                  </Typography>
                  {pref.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {pref.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
