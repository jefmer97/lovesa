import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary:
        mode === 'dark'
          ? {
              main: '#ffffff',
              light: '#f5f5f5',
              dark: '#cccccc',
            }
          : {
              main: '#e91e63',
              light: '#f48fb1',
              dark: '#c2185b',
            },
      secondary: {
        main: mode === 'dark' ? '#aaaaaa' : '#6b7280',
        light: '#e0e0e0',
        dark: '#4b5563',
      },
      background:
        mode === 'dark'
          ? {
              default: '#121212',
              paper: '#1e1e1e',
            }
          : {
              default: '#f9fafb',
              paper: '#ffffff',
            },
      text:
        mode === 'dark'
          ? {
              primary: '#ffffff',
              secondary: '#b3b3b3',
            }
          : {
              primary: '#111827',
              secondary: '#4b5563',
            },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px 0 rgba(0, 0, 0, 0.5)'
                : '0 4px 20px 0 rgba(0, 0, 0, 0.06)',
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            backgroundImage: 'none',
          },
        },
      },
    },
  });

export const theme = getAppTheme('dark');
