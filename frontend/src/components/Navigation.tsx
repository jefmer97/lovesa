'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#e91e63', 0.1),
  '&:hover': {
    backgroundColor: alpha('#e91e63', 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#c2185b'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#880e4f',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },
}));

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  if (!user) return null;

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #fce4ec', mb: 4 }}>
      <Toolbar>
        <FavoriteIcon sx={{ color: '#e91e63', mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#c2185b' }}>
          lovesa
        </Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar recuerdos o planes..."
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} href="/" color="inherit">Dashboard</Button>
          <Button component={Link} href="/calendar" color="inherit">Calendario</Button>
          <Button component={Link} href="/timeline" color="inherit">Historia</Button>
          <Button component={Link} href="/ideas" color="inherit">Ideas</Button>
          <Button component={Link} href="/experiencias" color="inherit">Planeador</Button>
          <Button onClick={logout} variant="outlined" color="primary">Salir</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
