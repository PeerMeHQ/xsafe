import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4c2ffc'
    },
    secondary: {
      main: '#4c2ffc8a'
    },
    black: {
      main: '#08041D'
    },
    background: {
      main: '#4c2ffc1a',
      white: '#FFFFFF',
      danger: '#e51a3e1a',
      default: '#F4F6FD'
    },
    danger: {
      main: '#e51a3e'
    },
    anchor: {
      main: '#4c2ffc8a'
    }
  },
  shape: {
    radius: '10px'
  },
  shadows: {
    main: '#4c2ffc2e',
    secondary: '#4c2ffc36'
  },
  typography: {
    bold: '600'
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});
