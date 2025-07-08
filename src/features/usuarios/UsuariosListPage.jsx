import React from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsuarios } from './usuariosSlice';

export default function UsuariosListPage() {
  // const dispatch = useDispatch();
  // const { usuarios, loading } = useSelector(state => state.usuarios);
  const usuarios = [];
  const loading = false;

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>Usuarios</Typography>
      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map(usuario => (
              <TableRow key={usuario._id}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Typography align="center" sx={{ my: 2 }}>Cargando...</Typography>}
        {!loading && usuarios.length === 0 && <Typography align="center" sx={{ my: 2 }}>No hay usuarios registrados.</Typography>}
      </Paper>
    </Container>
  );
}
