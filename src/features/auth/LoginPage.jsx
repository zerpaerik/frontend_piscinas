import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth || {});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/piscinas');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>Iniciar sesión</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <Button
            component={Link}
            to="/forgot-password"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
