import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth || {});
  const [form, setForm] = useState({ name: '', apellido: '', cedula: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/piscinas');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const passwordMatch = form.password && form.confirm && form.password === form.confirm;
  const showPasswordError = form.confirm && !passwordMatch;

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    if (!form.name || !form.apellido || !form.cedula || !form.email || !form.password || !form.confirm) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }
    if (!validateEmail(form.email)) {
      setLocalError('El correo electrónico no es válido');
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    const result = await dispatch(registerUser({
      name: form.name,
      apellido: form.apellido,
      cedula: form.cedula,
      email: form.email,
      password: form.password
    }));
    if (registerUser.fulfilled.match(result) && result.payload && result.payload.message) {
      setSuccess(result.payload.message);
      setTimeout(() => navigate('/piscinas'), 1200);
    }
  };


  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>Registro de usuario</Typography>
        <>
          {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nombre"
              name="name"
              fullWidth
              required
              margin="normal"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              label="Apellido"
              name="apellido"
              fullWidth
              required
              margin="normal"
              value={form.apellido}
              onChange={handleChange}
            />
            <TextField
              label="Cédula"
              name="cedula"
              fullWidth
              required
              margin="normal"
              value={form.cedula}
              onChange={handleChange}
            />
            <TextField
              label="Correo electrónico"
              name="email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              label="Confirmar contraseña"
              name="confirm"
              type="password"
              fullWidth
              required
              margin="normal"
              value={form.confirm}
              onChange={handleChange}
              error={showPasswordError}
              helperText={showPasswordError ? 'Las contraseñas no coinciden' : ''}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              disabled={loading || showPasswordError}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Button
              component={Link}
              to="/login"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </Box>
        </>
      </Paper>
    </Container>
  );
}
