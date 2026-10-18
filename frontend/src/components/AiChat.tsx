'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: Array<{
    tool: string;
    args: any;
    result: any;
  }>;
}

const TOOL_LABELS: Record<string, string> = {
  crearActividad: '📅 Actividad creada',
  modificarActividad: '✏️ Actividad modificada',
  eliminarActividad: '🗑️ Actividad eliminada',
  crearIdea: '💡 Idea guardada',
  modificarIdea: '✏️ Idea actualizada',
  eliminarIdea: '🗑️ Idea eliminada',
  programarRecordatorioPush: '⏰ Recordatorio Push programado',
  enviarNotificacionPushAhora: '📲 Notificación Push enviada',
  completarRecordatorio: '✅ Recordatorio completado',
};

export default function AiChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [localInput, setLocalInput] = useState('');

  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#_`~]/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
    }
  };

  const sendMessageToAi = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setLocalInput('');
    inputRef.current = '';
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor (${res.status})`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || '¡Listo!',
        actions: data.actionsPerformed || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.actionsPerformed && data.actionsPerformed.length > 0) {
        window.dispatchEvent(new Event('lovesa:data-updated'));
      }

      speakText(assistantMsg.content);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Hubo un inconveniente al procesar tu solicitud: ${err.message}. Intenta de nuevo.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz directo. Prueba en Chrome o Safari.');
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-PA';

    let finalTranscript = inputRef.current;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const newText = (finalTranscript + ' ' + interimTranscript).trim();
      setLocalInput(newText);
      inputRef.current = newText;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListeningAndSend = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);

    if (inputRef.current.trim() && !isLoading) {
      sendMessageToAi(inputRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
    inputRef.current = e.target.value;
  };

  const submitMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    sendMessageToAi(localInput);
  };

  if (!user) return null;

  if (!open) {
    return (
      <Tooltip title="Hablar con Director AI">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#e91e63',
            color: '#fff',
            '&:hover': { bgcolor: '#c2185b' },
            boxShadow: '0 4px 20px rgba(233, 30, 99, 0.5)',
            width: 64,
            height: 64,
            zIndex: 9999,
          }}
        >
          <AutoAwesomeIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    );
  }

  const quickPrompts = [
    '📅 Planeemos una cita sorpresa para Dei',
    '📲 Envíame una notificación push de prueba',
    '⏰ Recuérdame mañana comprarle flores a las 5pm',
    '💡 ¿Qué ideas a corto plazo tenemos pendientes?',
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: { xs: 12, sm: 24 },
        right: { xs: 12, sm: 24 },
        width: { xs: 'calc(100vw - 24px)', sm: 400 },
        height: { xs: '75vh', sm: 560 },
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.default',
        border: '1px solid #333',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid #333',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon fontSize="small" sx={{ color: '#e91e63' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary" lineHeight={1.2}>
              Director AI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Voz + Control Total + Alertas Push
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tooltip title={voiceOutputEnabled ? 'Silenciar voz de IA' : 'Activar voz de IA'}>
            <IconButton
              size="small"
              onClick={() => {
                if (voiceOutputEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                setVoiceOutputEnabled(!voiceOutputEnabled);
              }}
              sx={{ color: voiceOutputEnabled ? '#e91e63' : 'text.secondary', mr: 0.5 }}
            >
              {voiceOutputEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => {
              if (isListening && recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {}
                setIsListening(false);
              }
              setOpen(false);
            }}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              Hola Jeffreey 👋 Háblame con el micrófono o escribe para crear recuerdos, modificar citas, planear experiencias para Dei o programar alertas Push a tu teléfono.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickPrompts.map((qp, idx) => (
                <Chip
                  key={idx}
                  label={qp}
                  onClick={() => sendMessageToAi(qp)}
                  variant="outlined"
                  sx={{
                    justifyContent: 'flex-start',
                    height: 'auto',
                    py: 1,
                    px: 1,
                    '& .MuiChip-label': { whiteSpace: 'normal', fontSize: 12 },
                    cursor: 'pointer',
                    borderColor: '#444',
                    '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)', borderColor: '#e91e63' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
            }}
          >
            {m.actions && m.actions.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.8 }}>
                {m.actions.map((act, i) => (
                  <Chip
                    key={i}
                    size="small"
                    icon={<CheckCircleOutlineIcon />}
                    label={TOOL_LABELS[act.tool] || act.tool}
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: 11 }}
                  />
                ))}
              </Box>
            )}
            <Box
              sx={{
                bgcolor: m.role === 'user' ? '#e91e63' : 'background.paper',
                color: m.role === 'user' ? '#fff' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 1,
                border: m.role === 'user' ? 'none' : '1px solid #333',
                wordBreak: 'break-word',
                fontSize: 14,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <CircularProgress size={18} sx={{ color: '#e91e63' }} />
            <Typography variant="caption" color="text.secondary">
              Director AI está ejecutando...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={submitMessage}
        sx={{
          p: 1.2,
          borderTop: '1px solid #333',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Tooltip title={isListening ? 'Detener y enviar audio' : 'Hablar por micrófono'}>
          <IconButton
            onClick={isListening ? stopListeningAndSend : startListening}
            color={isListening ? 'error' : 'default'}
            sx={{
              mr: 1,
              bgcolor: isListening ? 'rgba(244, 67, 54, 0.15)' : 'transparent',
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.75; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <TextField
          fullWidth
          size="small"
          placeholder={
            isListening
              ? 'Escuchando... (toca el mic rojo para enviar)'
              : 'Háblale o escribe qué crear, cambiar o recordar...'
          }
          variant="outlined"
          value={localInput}
          onChange={handleInputChange}
          disabled={isLoading}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
        />
        <IconButton
          type="submit"
          disabled={!localInput.trim() || isLoading}
          sx={{ ml: 1, color: '#e91e63' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
