'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl, Button, Box, Typography, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import dynamic from 'next/dynamic';
import axios from 'axios';
import 'react-quill-new/dist/quill.snow.css';
import { API_URL } from '../config/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export const defaultEvent = { _id: '', title: '', description: '', startDate: '', endDate: '', isAllDay: false, notes: '', media: [] as string[], ideaId: '' };

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

  useEffect(() => {
    setEventData(initialEvent || defaultEvent);
  }, [initialEvent, open]);

  useEffect(() => {
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
          'Content-Type': 'multipart/form-data'
        }
      });
      setEventData((prev: any) => ({ ...prev, media: [...prev.media, res.data.url] }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate || eventData.startDate),
        isAllDay: eventData.isAllDay,
        notes: eventData.notes,
        media: eventData.media,
        ideaId: eventData.ideaId || null,
      };

      if (eventData._id) {
        await axios.put(`${API_URL}/activities/${eventData._id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${API_URL}/activities`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      
      onSave(); // call parent refresh
      onClose(); // close dialog
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{eventData._id ? 'Editar Actividad / Diario' : 'Nueva Actividad o Fecha Especial'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Vincular a una Idea (Opcional)</InputLabel>
            <Select
              value={eventData.ideaId || ''}
              onChange={e => setEventData({...eventData, ideaId: e.target.value as string})}
              label="Vincular a una Idea (Opcional)"
            >
              <MenuItem value=""><em>Ninguna</em></MenuItem>
              {ideas.map(idea => (
                <MenuItem key={idea._id} value={idea._id}>{idea.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Título (ej. Dar flores, Cena)" fullWidth variant="outlined" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} />
          <TextField label="Descripción" fullWidth variant="outlined" multiline rows={2} value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField variant="outlined" label="Fecha Inicio" type="datetime-local" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={eventData.startDate} onChange={e => setEventData({...eventData, startDate: e.target.value})} />
            <TextField variant="outlined" label="Fecha Fin" type="datetime-local" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={eventData.endDate} onChange={e => setEventData({...eventData, endDate: e.target.value})} />
          </Box>
          <FormControlLabel control={<Checkbox checked={eventData.isAllDay} onChange={e => setEventData({...eventData, isAllDay: e.target.checked})} />} label="Todo el día" />

          {/* Diario & Media Section */}
          <Typography variant="h6" color="primary" mt={2}>Diario de Recuerdos</Typography>
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>Escribe tus notas, memorias o lo que pasó al estilo Notion:</Typography>
            <Box sx={{ height: 200, mb: 6 }}>
              <ReactQuill theme="snow" value={eventData.notes} onChange={val => setEventData({...eventData, notes: val})} style={{ height: '100%' }} />
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
                  <img src={url} alt="Recuerdo" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                  <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }} onClick={() => setEventData((prev: any) => ({...prev, media: prev.media.filter((_: any, idx: number) => idx !== i)}))}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveClick}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
