import { Card } from 'react-bootstrap';
import { MainButton } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const InstallButton = styled(MainButton)(({ theme }) => ({
  '&&&': {
    width: '100%',
    fontSize: '15px',
    fontWeight: '400 !important',
    textTransform: 'none',
    color: theme.palette.primary.main,
    boxShadow: 'none !important',
    padding: 0,
    height: '36.25px',
    justifyContent: 'center',
    alignItems: 'center',
    '&:disabled': {
      backgroundColor: theme.palette.background.disabled,
      borderColor: theme.palette.background.disabled,
      color: theme.palette.text.disabled,
    },
  },
}));

export const PinButton = styled(InstallButton)(({ theme: _ }) => ({
  '&&&': {
    '@media (max-width: 459px)': {
      width: '30%',
    },
    '@media (min-width: 460px) and (max-width: 600px)': {
      width: '80%',
    },
  },
}));

export const AppCard = styled(Card)(({ theme }) => ({
  '&&&': {
    padding: '15px',
    width: '310px',
    height: 'auto',
    boxShadow: theme.shadows.reducedOpacity,
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: theme.palette.background.secondary,
    '@media (max-width:600px)': {
      width: '100%',
      height: '100%',
    },
  },
}));

export const TemplateCard = styled(AppCard)(({ theme: _ }) => ({
  '&&&': {
    padding: '0',
    width: 'auto',
    boxShadow: 'none',
  },
}));
