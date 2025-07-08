import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';

export const fetchPiscinas = createAsyncThunk('piscinas/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/piscinas');
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Error al listar piscinas';
    return rejectWithValue(msg);
  }
});

export const createPiscina = createAsyncThunk('piscinas/create', async (data, { rejectWithValue }) => {
  try {
    let payload = data;
    let headers = {};
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    const res = await api.post('/piscinas', payload, { headers });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Error al crear piscina';
    return rejectWithValue(msg);
  }
});

export const updatePiscina = createAsyncThunk('piscinas/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    let payload = data;
    let headers = {};
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }
    const res = await api.put(`/piscinas/${id}`, payload, { headers });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Error al editar piscina';
    return rejectWithValue(msg);
  }
});

export const deletePiscina = createAsyncThunk('piscinas/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/piscinas/${id}`);
    return id;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Error al eliminar piscina';
    return rejectWithValue(msg);
  }
});

const piscinasSlice = createSlice({
  name: 'piscinas',
  initialState: {
    piscinas: [],
    loading: false,
    error: null,
    piscina: null
  },
  reducers: {
    clearPiscina: (state) => { state.piscina = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPiscinas.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchPiscinas.fulfilled, (state, action) => {
        state.loading = false;
        state.piscinas = action.payload;
      })
      .addCase(fetchPiscinas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPiscina.pending, state => { state.loading = true; state.error = null; })
      .addCase(createPiscina.fulfilled, (state, action) => {
        state.loading = false;
        state.piscinas.push(action.payload);
      })
      .addCase(createPiscina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePiscina.pending, state => { state.loading = true; state.error = null; })
      .addCase(updatePiscina.fulfilled, (state, action) => {
        state.loading = false;
        state.piscinas = state.piscinas.map(p => p._id === action.payload._id ? action.payload : p);
      })
      .addCase(updatePiscina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePiscina.pending, state => { state.loading = true; state.error = null; })
      .addCase(deletePiscina.fulfilled, (state, action) => {
        state.loading = false;
        state.piscinas = state.piscinas.filter(p => p._id !== action.payload);
      })
      .addCase(deletePiscina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPiscina, clearError } = piscinasSlice.actions;
export default piscinasSlice.reducer;
