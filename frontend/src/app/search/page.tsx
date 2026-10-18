'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Typography, Card, CardContent, CircularProgress, Box, Chip } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import es from 'date-fns/locale/es';
import { API_URL } from '../../config/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [results, setResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user && q) {
      fetchResults(q);
    }
  }, [q, user, loading]);

  const fetchResults = async (query: string) => {
    setLoadingSearch(true);
    try {
      const res = await axios.get(`${API_URL}/activities?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResults(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (loading || !user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        Resultados de búsqueda
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Buscando: "{q}"
      </Typography>

      {loadingSearch ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : results.length === 0 ? (
        <Typography variant="body1">No se encontraron resultados.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {results.map(activity => (
            <Card key={activity._id} sx={{ '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
              <CardContent>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {activity.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  {format(parseISO(activity.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                </Typography>
                {activity.description && (
                  <Typography variant="body2" mb={1}>
                    {activity.description}
                  </Typography>
                )}
                {activity.notes && (
                  <Box mt={1} p={1} sx={{ bgcolor: '#fce4ec', borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="secondary">Nota del Diario:</Typography>
                    <Typography variant="body2" sx={{ '& *': { m: 0 } }} dangerouslySetInnerHTML={{ __html: activity.notes }} />
                  </Box>
                )}
                {activity.media && activity.media.length > 0 && (
                  <Box mt={1}>
                    <Chip size="small" label={`${activity.media.length} archivo(s)`} color="secondary" variant="outlined" />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>}>
      <SearchContent />
    </Suspense>
  );
}
