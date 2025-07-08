import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createPiscina, updatePiscina, fetchPiscinas } from './piscinasSlice';
import { useNavigate, useParams } from 'react-router-dom';

export default function PiscinaFormPage({ editMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error } = useSelector(state => state.piscinas);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    municipio: '',
    altura: '',
    ancho: '',
    temperaturaExterna: '',
    categoria: '', // 'Niños' | 'Adultos'
    totalProfundidades: '',
    profundidades: [''], // array de strings (luego se parsea a number)
    forma: '', // 'Rectangular' | 'Circular'
    uso: '', // 'Privada' | 'Publica'
    foto: null, // archivo imagen piscina
    bombas: [
      {
        marca: '',
        referencia: '',
        potencia: '',
        material: '', // 'Sumergible' | 'Centrifuga'
        seRepite: false,
        totalBombas: '',
        foto: null, // archivo imagen bomba
        hojaSeguridad: null, // PDF
        fichaTecnica: null, // PDF
      }
    ]
  });

  const handleChange = e => {
    const { name, value } = e.target;
    // Si cambia totalProfundidades, sincroniza la cantidad de inputs de profundidades
    if (name === 'totalProfundidades') {
      const n = Number(value) || 0;
      let nuevas = [...form.profundidades];
      if (n > nuevas.length) {
        nuevas = nuevas.concat(Array(n - nuevas.length).fill(''));
      } else if (n < nuevas.length) {
        nuevas = nuevas.slice(0, n);
      }
      setForm({ ...form, totalProfundidades: value, profundidades: nuevas });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Profundidades
  const handleProfundidadChange = (idx, value) => {
    const nuevas = [...form.profundidades];
    nuevas[idx] = value;
    setForm({ ...form, profundidades: nuevas });
  };
  const addProfundidad = () => {
    setForm({ ...form, profundidades: [...form.profundidades, ''] });
  };
  const removeProfundidad = idx => {
    if (form.profundidades.length > 1) {
      setForm({ ...form, profundidades: form.profundidades.filter((_, i) => i !== idx) });
    }
  };

  // Bombas
  const handleBombaChange = (idx, field, value) => {
    const nuevas = [...form.bombas];
    nuevas[idx][field] = value;
    setForm({ ...form, bombas: nuevas });
  };
  const addBomba = () => {
    setForm({ ...form, bombas: [...form.bombas, { marca: '', referencia: '', potencia: '', material: '', seRepite: false, totalBombas: '', foto: null, hojaSeguridad: null, fichaTecnica: null }] });
  };
  const removeBomba = idx => {
    if (form.bombas.length > 1) {
      setForm({ ...form, bombas: form.bombas.filter((_, i) => i !== idx) });
    }
  };


  const handleFileChange = (e, field, bombaIdx = null) => {
    const file = e.target.files[0];
    if (bombaIdx === null) {
      setForm({ ...form, [field]: file });
    } else {
      const nuevas = [...form.bombas];
      nuevas[bombaIdx][field] = file;
      setForm({ ...form, bombas: nuevas });
    }
  };

  const [localError, setLocalError] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError(null);
    // Validación: la cantidad de profundidades debe coincidir con totalProfundidades
    const expected = Number(form.totalProfundidades) || 0;
    if (form.profundidades.length !== expected) {
      setLocalError(`El número de profundidades (${form.profundidades.length}) debe coincidir con el valor de Total Profundidades (${expected})`);
      return;
    }
    // Construir FormData
    const fd = new FormData();
    fd.append('nombre', form.nombre);
    fd.append('direccion', form.direccion);
    fd.append('ciudad', form.ciudad);
    fd.append('municipio', form.municipio);
    fd.append('altura', form.altura ? Number(form.altura) : '');
    fd.append('ancho', form.ancho ? Number(form.ancho) : '');
    fd.append('temperaturaExterna', form.temperaturaExterna ? Number(form.temperaturaExterna) : '');
    fd.append('categoria', form.categoria);
    fd.append('totalProfundidades', form.totalProfundidades ? Number(form.totalProfundidades) : '');
    // El backend espera profundidades como array de números ordenados
    fd.append('profundidades', JSON.stringify(form.profundidades.map(p => Number(p))));
    fd.append('forma', form.forma);
    fd.append('uso', form.uso);
    if (form.foto) fd.append('foto', form.foto);
    // Bombas como array JSON y archivos asociados
    const bombasData = form.bombas.map((b, idx) => {
      const bomba = { ...b };
      delete bomba.foto;
      delete bomba.hojaSeguridad;
      delete bomba.fichaTecnica;
      // Archivos: el backend solo toma el primero de cada campo (por ahora)
      if (form.bombas[idx].foto) fd.append('bombas_foto', form.bombas[idx].foto);
      if (form.bombas[idx].hojaSeguridad) fd.append('bombas_hojaSeguridad', form.bombas[idx].hojaSeguridad);
      if (form.bombas[idx].fichaTecnica) fd.append('bombas_fichaTecnica', form.bombas[idx].fichaTecnica);
      // Convertir campos numéricos
      if (bomba.potencia !== undefined) bomba.potencia = Number(bomba.potencia);
      if (bomba.totalBombas !== undefined && bomba.totalBombas !== '') bomba.totalBombas = Number(bomba.totalBombas);
      if (typeof bomba.seRepite === 'string') bomba.seRepite = bomba.seRepite === 'true' || bomba.seRepite === true;
      return bomba;
    });
    fd.append('bombas', JSON.stringify(bombasData));
    try {
      let res;
      if (editMode) {
        res = await dispatch(updatePiscina({ id, data: fd }));
      } else {
        res = await dispatch(createPiscina(fd));
      }
      if (!res.error) {
        await dispatch(fetchPiscinas());
        navigate('/piscinas');
      } else {
        // Mostrar mensaje exacto del backend si existe
        let backendMsg = res.error?.message;
        if (res.error?.response?.data?.message) {
          backendMsg = res.error.response.data.message;
        } else if (res.error?.response?.data?.error) {
          backendMsg = res.error.response.data.error;
        }
        setLocalError(backendMsg || 'Error al guardar piscina');
      }
    } catch (err) {
      let backendMsg = err.message;
      if (err.response?.data?.message) backendMsg = err.response.data.message;
      else if (err.response?.data?.error) backendMsg = err.response.data.error;
      setLocalError(backendMsg || 'Error inesperado');
    }
  };


  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          {editMode ? 'Editar piscina' : 'Crear piscina'}
        </Typography>
        {localError && <Typography color="error" sx={{ mb: 2 }}>{localError}</Typography>}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Municipio" name="municipio" value={form.municipio} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Altura (m)" name="altura" type="number" value={form.altura} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ancho (m)" name="ancho" type="number" value={form.ancho} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Temperatura Externa (°C)" name="temperaturaExterna" type="number" value={form.temperaturaExterna} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="Niños">Niños</option>
                <option value="Adultos">Adultos</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Forma" name="forma" value={form.forma} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="Rectangular">Rectangular</option>
                <option value="Circular">Circular</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Uso" name="uso" value={form.uso} onChange={handleChange} fullWidth required SelectProps={{ native: true }}>
                <option value=""></option>
                <option value="Privada">Privada</option>
                <option value="Publica">Publica</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Total profundidades" name="totalProfundidades" type="number" value={form.totalProfundidades} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1">Foto de la piscina</Typography>
                <Button variant="outlined" component="label">
                  Seleccionar imagen
                  <input type="file" accept="image/*" hidden onChange={e => handleFileChange(e, 'foto')} />
                </Button>
                {form.foto && <Typography variant="body2" sx={{ mt: 1 }}>{form.foto.name}</Typography>}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Profundidades (m)</Typography>
              {form.profundidades.map((prof, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField
                    type="number"
                    value={prof}
                    onChange={e => handleProfundidadChange(idx, e.target.value)}
                    required
                    label={`Profundidad #${idx + 1}`}
                    sx={{ width: 120 }}
                  />
                  <Button variant="outlined" color="error" onClick={() => removeProfundidad(idx)} disabled={form.profundidades.length === 1}>-</Button>
                  {idx === form.profundidades.length - 1 && (
                    <Button variant="outlined" color="primary" onClick={addProfundidad}>+</Button>
                  )}
                </Box>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Bombas</Typography>
              {form.bombas.map((bomba, idx) => (
                <Box key={idx} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Marca" value={bomba.marca} onChange={e => handleBombaChange(idx, 'marca', e.target.value)} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Referencia" value={bomba.referencia} onChange={e => handleBombaChange(idx, 'referencia', e.target.value)} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Potencia (HP)" type="number" value={bomba.potencia} onChange={e => handleBombaChange(idx, 'potencia', e.target.value)} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField select label="Material" value={bomba.material} onChange={e => handleBombaChange(idx, 'material', e.target.value)} fullWidth required SelectProps={{ native: true }}>
                        <option value=""></option>
                        <option value="Sumergible">Sumergible</option>
                        <option value="Centrifuga">Centrifuga</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField select label="¿Se repite?" value={bomba.seRepite ? 'true' : ''} onChange={e => handleBombaChange(idx, 'seRepite', e.target.value === 'true')} fullWidth required SelectProps={{ native: true }}>
                        <option value=""></option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Total Bombas" type="number" value={bomba.totalBombas} onChange={e => handleBombaChange(idx, 'totalBombas', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2">Foto bomba</Typography>
                        <Button variant="outlined" component="label" size="small">
                          Seleccionar imagen
                          <input type="file" accept="image/*" hidden onChange={e => handleFileChange(e, 'foto', idx)} />
                        </Button>
                        {bomba.foto && <Typography variant="caption">{bomba.foto.name}</Typography>}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2">Hoja seguridad (PDF)</Typography>
                        <Button variant="outlined" component="label" size="small">
                          Seleccionar PDF
                          <input type="file" accept="application/pdf" hidden onChange={e => handleFileChange(e, 'hojaSeguridad', idx)} />
                        </Button>
                        {bomba.hojaSeguridad && <Typography variant="caption">{bomba.hojaSeguridad.name}</Typography>}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2">Ficha técnica (PDF)</Typography>
                        <Button variant="outlined" component="label" size="small">
                          Seleccionar PDF
                          <input type="file" accept="application/pdf" hidden onChange={e => handleFileChange(e, 'fichaTecnica', idx)} />
                        </Button>
                        {bomba.fichaTecnica && <Typography variant="caption">{bomba.fichaTecnica.name}</Typography>}
                      </Box>
                    </Grid>
                  </Grid>
                  <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
                    <Button variant="outlined" color="error" onClick={() => removeBomba(idx)} disabled={form.bombas.length === 1}>Eliminar bomba</Button>
                    {idx === form.bombas.length - 1 && (
                      <Button variant="outlined" color="primary" onClick={addBomba}>Agregar bomba</Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Guardar cambios' : 'Crear piscina'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/piscinas')}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
