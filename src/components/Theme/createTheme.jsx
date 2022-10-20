import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4c2ffc',
    },
    secondary: {
      main: '#4c2ffc8a',
    },
    black: {
      main: '#08041D',
      reducedOpacity: 'rgba(0, 0, 0, 0.6)',
      minorlyReducedOpacity: 'rgba(0, 0, 0, 0.87)',
      mediumReducedOpacity: 'rgba(0, 0, 0, 0.54)',
    },
    background: {
      main: '#4c2ffc1a',
      secondary: '#fff',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD',
      purple: '#e4e3fd',
    },
    text: {
      primary: '#FFF',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2ffc8a',
      secondary: '#6C757D',
    },
    divider: {
      main: '#DFDFE8',
    },
  },
  shape: {
    radius: '10px',
  },
  shadows: {
    main: '#4c2ffc2e',
    secondary: '#4c2ffc36',
    reducedOpacity: '0px 14px 24px rgba(76, 47, 252, 0.03)',
    reducedOpacityIcons: '0 5px 10px rgba(76, 47, 252, 0.03)',
  },
  hover: {
    table: { rows: '#F5F7FF' },
  },
  typography: {
    fontFamily: [
      'IBM Plex Sans',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    bold: '600',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  font: {
    weight: {
      xs: 300,
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,
      xxl: 800,
    },
    size: {
      xs: '10px',
      sm: '11px',
      md: '12px',
      lg: '13px',
      xl: '14px',
      xxl: '15px',
      xxxl: '16px',
    },
  },
  padding: {
    value: {
      xs: '3px',
      sm: '5px',
      md: '8px',
      lg: '10px',
      xl: '12px',
      xxl: '15px',
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4c2ffc',
    },
    secondary: {
      main: '#4c2ffc8a',
    },
    black: {
      main: '#08041D',
    },
    background: {
      main: '#4c2ffc1a',
      secondary: '#1E1D2A',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD',
    },
    danger: {
      main: '#e51a3e',
    },
    anchor: {
      main: '#4c2ffc8a',
      secondary: '#6C757D',
    },
    divider: {
      main: '#DFDFE8',
    },
  },
});
