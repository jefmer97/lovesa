'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from './theme';
import { useState, useEffect, createContext, useContext, useMemo } from 'react';

interface ThemeModeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('lovesa_theme_mode');
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.colorScheme = mode;
    document.body.style.backgroundColor = mode === 'dark' ? '#121212' : '#f9fafb';
    document.body.style.color = mode === 'dark' ? '#ffffff' : '#111827';
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('lovesa_theme_mode', next);
      return next;
    });
  };

  const activeTheme = useMemo(() => getAppTheme(mode), [mode]);

  if (!mounted) {
    return null; // Prevents SSR Emotion hydration mismatches
  }

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
