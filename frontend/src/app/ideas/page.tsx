'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, FormControl, InputLabel, IconButton, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../config/api';

export default function IdeasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', timeframe: 'anytime' });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) fetchIdeas();
    const handleRefresh = () => {
      if (user) fetchIdeas();
    };
    window.addEventListener('lovesa:data-updated', handleRefresh);
    return () => window.removeEventListener('lovesa:data-updated', handleRefresh);
  }, [user, loading, router]);

  const fetchIdeas = async () => {
    try {
      const res = await axios.get(`${API_URL}/ideas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIdeas(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/ideas`, newIdea, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOpen(false);
      fetchIdeas();
      setNewIdea({ title: '', description: '', timeframe: 'anytime' });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComplete = async (idea: any) => {
    try {
      await axios.put(`${API_URL}/ideas/${idea._id}`, { isCompleted: !idea.isCompleted }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchIdeas();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/ideas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchIdeas();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user) return null;

  const timeframes = [
    { value: 'short-term', label: 'Corto Plazo', color: 'primary' },
    { value: 'medium-term', label: 'Medio Plazo', color: 'secondary' },
    { value: 'long-term', label: 'Largo Plazo', color: 'warning' },
    { value: 'anytime', label: 'En cualquier momento', color: 'success' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="secondary">Banco de Ideas</Typography>
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>+ Nueva Idea</Button>
      </Box>

      <Grid container spacing={3}>
        {ideas.map((idea) => (
          <Grid item xs={12} sm={6} md={4} key={idea._id}>
            <Card sx={{ opacity: idea.isCompleted ? 0.6 : 1, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: idea.isCompleted ? 'line-through' : 'none' }}>
                    {idea.title}
                  </Typography>
                  <IconButton size="small" onClick={() => toggleComplete(idea)}>
                    {idea.isCompleted ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="textSecondary" mt={1} mb={2}>
                  {idea.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip size="small" label={timeframes.find(t => t.value === idea.timeframe)?.label} color={timeframes.find(t => t.value === idea.timeframe)?.color as any} />
                  <IconButton size="small" color="error" onClick={() => handleDelete(idea._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Añadir Nueva Idea</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Título (ej. Viaje a la playa)" fullWidth variant="outlined" value={newIdea.title} onChange={e => setNewIdea({...newIdea, title: e.target.value})} />
          <TextField margin="dense" label="Descripción detallada" fullWidth variant="outlined" multiline rows={3} value={newIdea.description} onChange={e => setNewIdea({...newIdea, description: e.target.value})} />
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Rango de Tiempo</InputLabel>
            <Select value={newIdea.timeframe} label="Rango de Tiempo" onChange={e => setNewIdea({...newIdea, timeframe: e.target.value})}>
              {timeframes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>Guardar Idea</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
