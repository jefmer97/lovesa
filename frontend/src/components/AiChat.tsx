'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Mic,
  ArrowUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../theme/ThemeRegistry';

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
  guardarGustoDeDei: '💖 Gusto de Dei guardado',
};

export default function AiChat() {
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);

  const isOpenRef = useRef(false);
  const isListeningRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const currentSessionFinalRef = useRef<string>('');
  const baseInputBeforeRecordRef = useRef<string>('');

  // MediaRecorder refs for Gemini `/ai/transcribe`
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcribePromiseRef = useRef<Promise<string | null> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storageKey = user ? `lovesa_chat_messages_${(user as any)._id || user.email || 'default'}` : 'lovesa_chat_messages_default';

  // Restore open state & cached messages on mount, then sync from MongoDB
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const savedOpen = localStorage.getItem('lovesa_chat_open');
    if (savedOpen === 'true') {
      setIsOpen(true);
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {}

    const token = localStorage.getItem('token');
    fetch(`${API_URL}/ai/history`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((serverHistory) => {
        if (Array.isArray(serverHistory) && serverHistory.length > 0) {
          setMessages(serverHistory);
          try {
            localStorage.setItem(storageKey, JSON.stringify(serverHistory));
          } catch (e) {}
        }
      })
      .catch((err) => console.warn('Could not fetch AI chat history:', err));
  }, [user, storageKey]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {}
  }, [messages, user, storageKey]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('lovesa_chat_open', isOpen ? 'true' : 'false');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);


  const getUserLang = () => {
    if (typeof navigator !== 'undefined') return navigator.language || 'es-PA';
    return 'es-PA';
  };

  const speakText = (text: string) => {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    if (!isOpenRef.current) return;
    try {
      window.speechSynthesis.cancel();
      isAiSpeakingRef.current = true;
      const cleanText = text
        .replace(/[*#_`~]/g, '')
        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
        .trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = getUserLang();
      utterance.rate = 1.2;
      utterance.onend = () => {
        isAiSpeakingRef.current = false;
      };
      utterance.onerror = () => {
        isAiSpeakingRef.current = false;
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
    }
  };

  // Initialize Web Speech API for live interim preview (same pattern as Delisa Standalone Menu)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Prevents Android Chrome duplication bug
        recognition.interimResults = true;
        recognition.lang = getUserLang();

        recognition.onresult = (event: any) => {
          let final = '';
          let interim = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          currentSessionFinalRef.current = final;
          const currentText = (
            finalTranscriptRef.current +
            ' ' +
            final +
            ' ' +
            interim
          )
            .replace(/\s+/g, ' ')
            .trim();
          setInputMessage(currentText);
        };

        recognition.onend = () => {
          if (currentSessionFinalRef.current) {
            finalTranscriptRef.current = (
              finalTranscriptRef.current +
              ' ' +
              currentSessionFinalRef.current
            )
              .replace(/\s+/g, ' ')
              .trim();
            currentSessionFinalRef.current = '';
          }
          if (isListeningRef.current) {
            // Keep listening alive until user explicitly presses the mic button again
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.onerror = (e: any) => {
          if (e.error !== 'no-speech' && e.error !== 'aborted') {
            console.warn('Speech recognition notice:', e.error);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      isListeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const startRecording = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isAiSpeakingRef.current = false;
    }

    baseInputBeforeRecordRef.current = inputMessage.trim();
    finalTranscriptRef.current = inputMessage.trim();
    currentSessionFinalRef.current = '';
    isListeningRef.current = true;
    setIsListening(true);

    // 1. Start live interim preview via SpeechRecognition (like Delisa Standalone Menu)
    try {
      recognitionRef.current?.start();
    } catch (e) {}

    // 2. Start high-accuracy audio capture via MediaRecorder for Gemini `/ai/transcribe`
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // If user already stopped before getUserMedia resolved, clean up immediately
        if (!isListeningRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        mediaStreamRef.current = stream;
        audioChunksRef.current = [];

        const preferredMime =
          typeof MediaRecorder !== 'undefined' &&
          MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : typeof MediaRecorder !== 'undefined' &&
              MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : '';

        const recorder = preferredMime
          ? new MediaRecorder(stream, { mimeType: preferredMime })
          : new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current = recorder;
        recorder.start(250);
      } catch (err) {
        console.warn('MediaRecorder unavailable, relying on SpeechRecognition:', err);
      }
    }
  };

  const stopRecording = (): Promise<string | null> => {
    isListeningRef.current = false;
    setIsListening(false);

    try {
      recognitionRef.current?.stop();
    } catch (e) {}

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      return Promise.resolve(null);
    }

    const promise = new Promise<string | null>((resolve) => {
      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const chunks = [...audioChunksRef.current];
        audioChunksRef.current = [];

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
        mediaRecorderRef.current = null;

        if (chunks.length === 0) {
          resolve(null);
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType });
        if (audioBlob.size < 800) {
          resolve(null);
          return;
        }

        setIsTranscribing(true);
        try {
          const audioDataUrl = await blobToDataUrl(audioBlob);
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/ai/transcribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              audioDataUrl,
              mimeType,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.text && data.text.trim()) {
              const prefix = baseInputBeforeRecordRef.current;
              const combined = (prefix ? `${prefix} ${data.text.trim()}` : data.text.trim())
                .replace(/\s+/g, ' ')
                .trim();
              setInputMessage(combined);
              finalTranscriptRef.current = combined;
              currentSessionFinalRef.current = '';
              resolve(combined);
              return;
            }
          }
          resolve(null);
        } catch (err) {
          console.warn('Transcribe request error:', err);
          resolve(null);
        } finally {
          setIsTranscribing(false);
          transcribePromiseRef.current = null;
        }
      };

      try {
        recorder.stop();
      } catch (e) {
        resolve(null);
      }
    });

    transcribePromiseRef.current = promise;
    return promise;
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isListening) {
      stopRecording();
    }
    isAiSpeakingRef.current = false;
  };

  const handleClearHistory = async () => {
    if (!window.confirm('¿Quieres limpiar esta conversación y empezar un chat nuevo? (Tus actividades, ideas y recordatorios guardados NO se borrarán)')) {
      return;
    }
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/ai/history`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInputMessage('');
    finalTranscriptRef.current = '';
    currentSessionFinalRef.current = '';
    baseInputBeforeRecordRef.current = '';

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
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
          message: trimmed,
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
        id: data.id || (Date.now() + 1).toString(),
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
          content: `Lo siento, tuve un problema de conexión (${err.message}). ¿Puedes intentarlo de nuevo?`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    let msgToSend = inputMessage;
    if (isListening) {
      const transcribed = await stopRecording();
      if (transcribed) {
        msgToSend = transcribed;
      }
    } else if (transcribePromiseRef.current) {
      const transcribed = await transcribePromiseRef.current;
      if (transcribed) {
        msgToSend = transcribed;
      }
    }
    if (!msgToSend.trim()) return;
    sendMessage(msgToSend);
  };

  if (!user) return null;

  const quickPrompts = [
    '📅 Planeemos una cita sorpresa para Dei',
    '📲 Envíame una notificación push de prueba',
    '⏰ Recuérdame mañana comprarle flores a las 5pm',
    '💡 ¿Qué ideas a corto plazo tenemos pendientes?',
  ];

  return (
    <Box>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes aiSoundWave {
              0%, 100% { transform: scaleY(0.4); }
              50% { transform: scaleY(1); }
            }
          `,
        }}
      />

      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Tooltip title="Abrir Director AI">
            <Box
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(15);
                }
                setIsOpen(true);
              }}
              sx={{
                bgcolor: '#e91e63',
                color: 'white',
                width: 64,
                height: 64,
                borderRadius: '50%',
                boxShadow: '0 10px 25px rgba(233, 30, 99, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.06)', bgcolor: '#c2185b' },
              }}
            >
              <Sparkles size={30} />
            </Box>
          </Tooltip>
        </Box>
      )}

      {/* CHAT MODAL (Delisa Standalone Menu style) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 24 },
          right: { xs: 0, sm: 24 },
          width: { xs: '100%', sm: 390 },
          height: { xs: '100%', sm: '600px' },
          maxHeight: '100%',
          bgcolor: isDark ? '#121212' : '#f9fafb',
          borderRadius: { xs: 0, sm: '24px' },
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          border: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 120ms ease-out',
          transform: isOpen ? 'translateY(0)' : 'translateY(120%)',
          overflow: 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'rgba(233, 30, 99, 0.15)',
                color: '#e91e63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.1 }}>
                Director AI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mt: 0.25,
                }}
              >
                Transcribe IA • Acciones • Alertas Push
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {messages.length > 0 && (
              <Tooltip title="Nueva conversación (limpiar historial de chat)">
                <IconButton
                  size="small"
                  onClick={handleClearHistory}
                  sx={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={voiceOutputEnabled ? 'Silenciar voz de IA' : 'Activar voz de IA'}>
              <IconButton
                size="small"
                onClick={() => {
                  if (voiceOutputEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    isAiSpeakingRef.current = false;
                  }
                  setVoiceOutputEnabled(!voiceOutputEnabled);
                }}
                sx={{ color: voiceOutputEnabled ? '#e91e63' : isDark ? '#9ca3af' : '#6b7280' }}
              >
                {voiceOutputEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={closeChat}
              sx={{ color: isDark ? '#ffffff' : '#111827' }}
            >
              <ChevronDown size={22} />
            </IconButton>
          </Box>
        </Box>

        {/* Messages container */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
          onClick={() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window && isAiSpeakingRef.current) {
              window.speechSynthesis.cancel();
              isAiSpeakingRef.current = false;
            }
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  bgcolor: isDark ? '#1e1e1e' : '#ffffff',
                  color: isDark ? '#ffffff' : '#111827',
                  px: 2,
                  py: 1.5,
                  borderRadius: '20px',
                  borderTopLeftRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: '0.93rem' }}>
                  Hola Jeffreey 👋. ¿Qué quieres planear, recordar o guardar hoy con Dei? Puedes escribirme o tocar el micrófono para hablarme.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickPrompts.map((qp, idx) => (
                  <Chip
                    key={idx}
                    label={qp}
                    onClick={() => sendMessage(qp)}
                    variant="outlined"
                    sx={{
                      justifyContent: 'flex-start',
                      height: 'auto',
                      py: 1,
                      px: 1,
                      bgcolor: isDark ? '#1e1e1e' : '#ffffff',
                      color: isDark ? '#e5e7eb' : '#374151',
                      borderColor: isDark ? '#333' : '#e5e7eb',
                      '& .MuiChip-label': { whiteSpace: 'normal', fontSize: 12.5 },
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(233, 30, 99, 0.08)',
                        borderColor: '#e91e63',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.actions && msg.actions.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.75 }}>
                  {msg.actions.map((act, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7',
                        color: isDark ? '#4ade80' : '#15803d',
                        border: isDark ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #bbf7d0',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {TOOL_LABELS[act.tool] || act.tool}
                    </Box>
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  maxWidth: '90%',
                  bgcolor:
                    msg.role === 'user'
                      ? '#e91e63'
                      : isDark
                      ? '#1e1e1e'
                      : '#ffffff',
                  color:
                    msg.role === 'user'
                      ? '#ffffff'
                      : isDark
                      ? '#ffffff'
                      : '#111827',
                  px: 2,
                  py: 1.25,
                  borderRadius: '20px',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                  borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border:
                    msg.role === 'assistant'
                      ? isDark
                        ? '1px solid #2d2d2d'
                        : '1px solid #e5e7eb'
                      : 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.38,
                    color: 'inherit',
                    fontSize: '0.93rem',
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '90%' }}>
              <Box
                sx={{
                  bgcolor: isDark ? '#1e1e1e' : '#ffffff',
                  px: 2,
                  py: 2,
                  borderRadius: '20px',
                  borderTopLeftRadius: '4px',
                  border: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 6,
                        height: 6,
                        bgcolor: '#e91e63',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: `${i * 0.16}s`,
                        '@keyframes bounce': {
                          '0%, 80%, 100%': { transform: 'scale(0.5)', opacity: 0.5 },
                          '40%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Bottom Input Bar (Delisa Standalone Menu style) */}
        <Box
          sx={{
            p: 2,
            bgcolor: isDark ? '#1e1e1e' : '#ffffff',
            borderTop: isDark ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
          }}
        >
          {isTranscribing && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                mb: 0.75,
                px: 1,
                color: '#e91e63',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <Loader2 size={13} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              Transcribiendo tu voz con IA...
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              bgcolor: isDark ? '#121212' : '#ffffff',
              borderRadius: '24px',
              px: 1,
              py: 0.5,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: isListening
                ? '1.5px solid #dc2626'
                : isDark
                ? '1px solid #333'
                : '1px solid #e2e8f0',
              position: 'relative',
              minHeight: '46px',
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
              <textarea
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  finalTranscriptRef.current = e.target.value;
                  currentSessionFinalRef.current = '';
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  e.target.style.overflowY = e.target.scrollHeight > 120 ? 'auto' : 'hidden';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? 'Escuchando... (presiona el micrófono para terminar)'
                    : isTranscribing
                    ? 'Transcribiendo con IA...'
                    : 'Escribe o presiona el micrófono...'
                }
                disabled={isLoading}
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px 12px',
                  margin: '0 4px',
                  background: 'transparent',
                  color: isDark ? '#ffffff' : '#111827',
                  fontSize: '15px',
                  lineHeight: '20px',
                  resize: 'none',
                  height: '36px',
                  maxHeight: '120px',
                  overflowY: 'hidden',
                  fontFamily: 'inherit',
                }}
                ref={(el) => {
                  if (el && !inputMessage) {
                    el.style.height = '36px';
                  } else if (el) {
                    el.style.height = 'auto';
                    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, pr: 0.5, pb: '2px' }}>
              <Tooltip
                title={
                  isListening
                    ? 'Presiona para dejar de escuchar y transcribir'
                    : 'Presiona para hablar'
                }
              >
                <IconButton
                  onClick={toggleListening}
                  disabled={isLoading || isTranscribing}
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    bgcolor: isListening
                      ? '#fee2e2'
                      : isDark
                      ? '#262626'
                      : '#f3f4f6',
                    color: isListening
                      ? '#dc2626'
                      : isDark
                      ? '#e5e7eb'
                      : '#374151',
                    '&:hover': {
                      bgcolor: isListening
                        ? '#fecaca'
                        : isDark
                        ? '#333'
                        : '#d1d5db',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {isListening ? (
                    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', height: 14 }}>
                      <Box
                        sx={{
                          width: '3px',
                          height: '100%',
                          bgcolor: 'currentColor',
                          animation: 'aiSoundWave 1s infinite',
                          animationDelay: '0s',
                        }}
                      />
                      <Box
                        sx={{
                          width: '3px',
                          height: '100%',
                          bgcolor: 'currentColor',
                          animation: 'aiSoundWave 1s infinite',
                          animationDelay: '0.2s',
                        }}
                      />
                      <Box
                        sx={{
                          width: '3px',
                          height: '100%',
                          bgcolor: 'currentColor',
                          animation: 'aiSoundWave 1s infinite',
                          animationDelay: '0.4s',
                        }}
                      />
                    </Box>
                  ) : (
                    <Mic size={18} />
                  )}
                </IconButton>
              </Tooltip>

              <IconButton
                color="inherit"
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !isListening) || isLoading || isTranscribing}
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  bgcolor: '#e91e63',
                  color: 'white',
                  opacity: 0.95,
                  '&:hover': { opacity: 1, bgcolor: '#c2185b' },
                  '&.Mui-disabled': {
                    bgcolor: isDark ? '#262626' : '#f3f4f6',
                    color: isDark ? '#525252' : '#9ca3af',
                    opacity: 1,
                  },
                }}
              >
                <ArrowUp size={18} strokeWidth={3} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
