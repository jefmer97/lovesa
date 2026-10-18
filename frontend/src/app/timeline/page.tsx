'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, InputBase } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ActivityDialog, { defaultEvent } from '../../components/ActivityDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../../config/api';

export default function TimelinePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(defaultEvent);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) fetchEvents();
    const handleRefresh = () => {
      if (user) fetchEvents();
    };
    window.addEventListener('lovesa:data-updated', handleRefresh);
    return () => window.removeEventListener('lovesa:data-updated', handleRefresh);
  }, [user, loading, router]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const sortedEvents = res.data.sort((a: any, b: any) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setEvents(sortedEvents);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && quickInput.trim()) {
      e.preventDefault();
      try {
        const payload = {
          title: quickInput.trim(),
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          isAllDay: true,
          notes: '',
          media: [],
          ideaId: null,
        };
        await axios.post(`${API_URL}/activities`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setQuickInput('');
        fetchEvents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (event: any) => {
    setSelectedEvent({
      ...event,
      startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm"),
    });
    setOpen(true);
  };

  if (loading || !user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">Nuestra Historia</Typography>
          <Typography variant="body1" color="textSecondary">Una línea de tiempo de nuestros mejores recuerdos.</Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={() => { setSelectedEvent(defaultEvent); setOpen(true); }} startIcon={<FavoriteIcon />}>
          Agregar Recuerdo
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {/* Casilla para agregar nuevo recuerdo al tope */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.2, display: { xs: 'none', sm: 'block' } }}>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 'bold' }}>
                Hoy
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: 'text.primary' }}>
                <FavoriteIcon sx={{ color: 'background.default', fontSize: 16 }} />
              </TimelineDot>
              {events.length > 0 && <TimelineConnector sx={{ bgcolor: 'text.secondary' }} />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Paper
                elevation={1}
                sx={{ p: 0, borderRadius: 3, display: 'flex', alignItems: 'center', bgcolor: 'background.paper', border: '1px solid #333' }}
              >
                <InputBase
                  sx={{ ml: 2, flex: 1, py: 1.5, color: 'text.primary' }}
                  placeholder="Escribe la acción o actividad y presiona Enter..."
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  onKeyDown={handleQuickSubmit}
                />
                <Typography color="text.secondary" variant="body2" sx={{ pr: 3, pl: 1, whiteSpace: 'nowrap', borderLeft: '1px solid #333', py: 1 }}>
                  {format(new Date(), "d 'de' MMMM", { locale: es })}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>

          {events.map((event, index) => (
            <TimelineItem key={event._id}>
              <TimelineOppositeContent sx={{ flex: 0.2, display: { xs: 'none', sm: 'block' } }}>
                <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 'bold' }}>
                  {format(new Date(event.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: 'text.primary' }}>
                  <FavoriteIcon sx={{ color: 'background.default', fontSize: 16 }} />
                </TimelineDot>
                {index < events.length - 1 && <TimelineConnector sx={{ bgcolor: 'text.secondary' }} />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: 3, cursor: 'pointer', border: '1px solid #333', '&:hover': { bgcolor: '#2a2a2a' } }}
                  onClick={() => handleEdit(event)}
                >
                  <Typography display={{ xs: 'block', sm: 'none' }} color="textSecondary" variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {format(new Date(event.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">{event.title}</Typography>
                  {event.description && <Typography>{event.description}</Typography>}
                  
                  {event.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                      <Typography component="div" variant="body2" dangerouslySetInnerHTML={{ __html: event.notes }} />
                    </Box>
                  )}

                  {event.media && event.media.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {event.media.map((url: string, idx: number) => (
                        <img key={idx} src={url} alt="Recuerdo" style={{ height: 120, borderRadius: 8, objectFit: 'cover' }} />
                      ))}
                    </Box>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
          
          {events.length === 0 && (
            <Typography align="center" color="textSecondary" sx={{ mt: 4 }}>Aún no hay recuerdos registrados. ¡Agrega el primero!</Typography>
          )}
        </Timeline>
      </Paper>

      <ActivityDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={fetchEvents}
        initialEvent={selectedEvent}
      />
    </Container>
  );
}
