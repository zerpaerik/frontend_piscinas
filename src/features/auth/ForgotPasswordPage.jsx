import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSent(false);
    // Aquí deberías llamar a tu endpoint real de recuperación
    if (!email) {
      setError('El correo es obligatorio');
      return;
    }
    setSent(true);
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>Recuperar contraseña</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {sent && <Alert severity="success" sx={{ mb: 2 }}>Si el correo existe, recibirás instrucciones para restablecer tu contraseña.</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
          >
            Recuperar contraseña
          </Button>
          <Button
            component={Link}
            to="/login"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Volver al login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
