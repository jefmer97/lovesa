'use client';

import React, { useState } from 'react';
import { Container, Card, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { API_URL } from '../../config/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="secondary" gutterBottom>
          Crear Cuenta
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Comienza a organizar tus metas
        </Typography>
        
        {error && <Typography color="error" mb={2}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Nombre" 
            variant="outlined" 
            margin="normal" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
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
            color="secondary" 
            type="submit" 
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
        </form>
        
        <Typography variant="body2" mt={2}>
          ¿Ya tienes cuenta? <Link href="/login" style={{ color: '#9c27b0' }}>Inicia sesión aquí</Link>
        </Typography>
      </Card>
    </Container>
  );
}
