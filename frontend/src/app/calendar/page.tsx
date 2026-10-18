'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Card, Box, Button } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ActivityDialog, { defaultEvent } from '../../components/ActivityDialog';
import { API_URL } from '../../config/api';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<any>(defaultEvent);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      fetchEvents();
    }
  }, [user, loading, router]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const formatted = res.data.map((ev: any) => ({
        ...ev,
        start: new Date(ev.startDate),
        end: new Date(ev.endDate),
      }));
      setEvents(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSlot = (slotInfo: any) => {
    setNewEvent({
      ...defaultEvent,
      startDate: format(slotInfo.start, "yyyy-MM-dd'T'HH:mm"),
      endDate: format(slotInfo.end, "yyyy-MM-dd'T'HH:mm"),
      isAllDay: true
    });
    setOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setNewEvent({
      ...event,
      startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm"),
      media: event.media || [],
      notes: event.notes || ''
    });
    setOpen(true);
  };

  if (loading || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Calendario de Pareja</Typography>
        <Button variant="contained" color="primary" onClick={() => { setNewEvent(defaultEvent); setOpen(true); }}>+ Nueva Actividad</Button>
      </Box>

      <Card sx={{ p: 2, height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%', fontFamily: 'inherit' }}
          culture="es"
          messages={{ next: "Sig", previous: "Ant", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
        />
      </Card>

      <ActivityDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={fetchEvents}
        initialEvent={newEvent}
      />
    </Container>
  );
}
