'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { Box, IconButton, Paper, Typography, TextField, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [localInput, setLocalInput] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<string>(''); // Para tener acceso síncrono al último valor dictado

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    body: {
      data: { token }
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    let finalTranscript = inputRef.current; // Arrancamos con lo que ya estaba escrito

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
      console.error(event.error);
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
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    // Si hay texto, se envía automáticamente al apagar el mic
    if (inputRef.current.trim() && !isLoading) {
      sendMessage({ text: inputRef.current });
      setLocalInput('');
      inputRef.current = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalInput(e.target.value);
      inputRef.current = e.target.value;
  };

  const submitMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    }

    sendMessage({ text: localInput });
    setLocalInput('');
    inputRef.current = '';
  };

  // Auto-encender micrófono cuando se abre el chat
  useEffect(() => {
    if (open) {
      setTimeout(() => {
         if (!isListening) {
            startListening();
         }
      }, 300); // Pequeño delay para que la animación de apertura termine
    } else {
      if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setIsListening(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) {
    return (
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'text.primary',
          color: 'background.default',
          '&:hover': { bgcolor: 'text.secondary' },
          boxShadow: 3,
          width: 64,
          height: 64,
          zIndex: 9999
        }}
      >
        <AutoAwesomeIcon fontSize="large" />
      </IconButton>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 350,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #333', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon fontSize="small" /> Director AI
        </Typography>
        <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            Hola Jeffreey. ¿Qué vamos a planear para Deilyn hoy?
          </Typography>
        )}
        {messages.map((m) => (
          <Box key={m.id} sx={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <Box
              sx={{
                bgcolor: m.role === 'user' ? 'text.primary' : 'background.paper',
                color: m.role === 'user' ? 'background.default' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 1,
                border: m.role === 'user' ? 'none' : '1px solid #333',
                wordBreak: 'break-word',
                fontSize: 14
              }}
            >
              {m.parts ? m.parts.map((p: any, i: number) => {
                if (p.type === 'text') return <div key={i}>{p.text}</div>;
                if (p.type?.startsWith('tool-')) return <div key={i}>🔧 {p.type} {p.result ? '✅' : <CircularProgress size={10} />}</div>;
                return null;
              }) : (m.content || m.text)}
            </Box>
          </Box>
        ))}
      </Box>

      <Box component="form" onSubmit={submitMessage} sx={{ p: 1, borderTop: '1px solid #333', bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
        
        <IconButton 
          onClick={isListening ? stopListeningAndSend : startListening} 
          color={isListening ? "error" : "default"} 
          sx={{ mr: 1, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
        >
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <TextField
          fullWidth
          size="small"
          placeholder={isListening ? "Escuchando..." : "Dile a la IA qué hacer..."}
          variant="outlined"
          value={localInput}
          onChange={handleInputChange}
          disabled={isLoading}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
        />
        <IconButton type="submit" disabled={!localInput.trim() || isLoading} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
