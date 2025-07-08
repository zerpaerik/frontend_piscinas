import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 4 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
          Bienvenido a Piscinas App
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Gestiona piscinas, usuarios y equipos de forma moderna y eficiente.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          ¿Aún no tienes cuenta? ¡Regístrate gratis!
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" sx={{ flex: 1 }} onClick={() => navigate('/login')}>
          Iniciar sesión
        </Button>
        <Button variant="outlined" color="primary" sx={{ flex: 1 }} onClick={() => navigate('/register')}>
          Registrarse
        </Button>
        <Button variant="outlined" color="secondary" sx={{ flex: 1 }} onClick={() => navigate('/piscinas')}>
          Ver piscinas
        </Button>
      </Box>
    </Container>
  );
}
