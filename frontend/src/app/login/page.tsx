'use client';

import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { API_URL } from '../../config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Entra a tu organizador de metas
        </Typography>
        
        {error && <Typography color="error" mb={2}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            margin="normal" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <TextField 
            fullWidth 
            label="Contraseña" 
            type="password" 
            variant="outlined" 
            margin="normal" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button 
            fullWidth 
            size="large" 
            variant="contained" 
            color="primary" 
            type="submit" 
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </form>
        
        <Typography variant="body2" mt={2}>
          ¿No tienes cuenta? <Link href="/register" style={{ color: '#e91e63' }}>Regístrate aquí</Link>
        </Typography>
      </Card>
    </Container>
  );
}
