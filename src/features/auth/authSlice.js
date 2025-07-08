import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api';

export const loginUser = createAsyncThunk('auth/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      return rejectWithValue(err.response.data.error);
    }
    return rejectWithValue('Error de red o del servidor');
  }
});

// Registro: si es exitoso, hace login automático
export const registerUser = createAsyncThunk('auth/registerUser', async (data, { dispatch, rejectWithValue }) => {
  try {
    const payload = {
      nombre: data.name,
      apellido: data.apellido || '',
      cedula: data.cedula || '',
      email: data.email,
      password: data.password,
      rol: 'ADMIN'
    };
    console.log('[registerUser] Payload enviado:', payload);
    const response = await api.post('/auth/register', payload);
    console.log('[registerUser] Respuesta del backend:', response);
    if (response && response.data && response.data.message) {
      // Si fue exitoso, hace login automático
      await dispatch(loginUser({ email: data.email, password: data.password }));
      return { message: response.data.message };
    }
    // Si el backend responde pero no trae message
    return rejectWithValue('Registro fallido, respuesta inesperada');
  } catch (err) {
    console.error('[registerUser] Error:', err);
    if (err.response && err.response.data && err.response.data.error) {
      return rejectWithValue(err.response.data.error);
    }
    if (err.response && err.response.data && err.response.data.message) {
      return rejectWithValue(err.response.data.message);
    }
    return rejectWithValue('Error de red o del servidor');
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error de login';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // No se actualiza user/token aquí. El login automático lo hará.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error de registro';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
