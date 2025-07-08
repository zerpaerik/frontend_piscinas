import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, Edit, Delete, Logout } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function PiscinasListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { piscinas, loading } = useSelector(state => state.piscinas);
  // const piscinas = [];
  // const loading = false;
  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Piscinas</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/piscinas/new')}>
            Nueva piscina
          </Button>
          {isAuthenticated && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={() => setOpenLogout(true)}
              >
                Cerrar sesión
              </Button>
              <Dialog
                open={openLogout}
                onClose={() => setOpenLogout(false)}
                aria-labelledby="logout-dialog-title"
              >
                <DialogTitle id="logout-dialog-title">¿Cerrar sesión?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ¿Estás seguro que deseas cerrar sesión? Deberás iniciar sesión nuevamente para acceder al sistema.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenLogout(false)} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={handleLogout} color="error" variant="contained">
                    Cerrar sesión
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Box>
      <Grid container spacing={3}>
        {piscinas.map(piscina => (
          <Grid item xs={12} sm={6} md={4} key={piscina._id}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{piscina.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">Dirección: {piscina.direccion}</Typography>
                <Typography variant="body2" color="text.secondary">Ciudad: {piscina.ciudad} - Municipio: {piscina.municipio}</Typography>
                <Typography variant="body2" color="text.secondary">Altura: {piscina.altura} m | Ancho: {piscina.ancho} m</Typography>
                <Typography variant="body2" color="text.secondary">Temperatura Externa: {piscina.temperaturaExterna ?? '-'} °C</Typography>
                <Typography variant="body2" color="text.secondary">Categoría: {piscina.categoria} | Forma: {piscina.forma} | Uso: {piscina.uso}</Typography>
                <Typography variant="body2" color="text.secondary">Total profundidades: {piscina.totalProfundidades}</Typography>
                <Typography variant="body2" color="text.secondary">Profundidades: {Array.isArray(piscina.profundidades) ? piscina.profundidades.join(', ') : '-'}</Typography>
                <Box mt={1}>
                  <Typography variant="subtitle2">Bombas:</Typography>
                  {Array.isArray(piscina.bombas) && piscina.bombas.length > 0 ? (
                    <Box component="table" sx={{ width: '100%', mt: 1, mb: 1, background: '#fafafa', borderRadius: 1 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: 4 }}>Marca</th>
                          <th style={{ textAlign: 'left', padding: 4 }}>Referencia</th>
                          <th style={{ textAlign: 'left', padding: 4 }}>Potencia</th>
                          <th style={{ textAlign: 'left', padding: 4 }}>Material</th>
                          <th style={{ textAlign: 'left', padding: 4 }}>Total Bombas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {piscina.bombas.map((b, i) => (
                          <tr key={i}>
                            <td style={{ padding: 4 }}>{b.marca}</td>
                            <td style={{ padding: 4 }}>{b.referencia}</td>
                            <td style={{ padding: 4 }}>{b.potencia}</td>
                            <td style={{ padding: 4 }}>{b.material}</td>
                            <td style={{ padding: 4 }}>{b.totalBombas ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No hay bombas registradas.</Typography>
                  )}
                </Box>
              </Box>
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <IconButton color="primary" onClick={() => navigate(`/piscinas/${piscina._id}/edit`)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => {}}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {loading && <Typography align="center" sx={{ mt: 4 }}>Cargando...</Typography>}
      {!loading && piscinas.length === 0 && <Typography align="center" sx={{ mt: 4 }}>No hay piscinas registradas.</Typography>}
    </Container>
  );
}
