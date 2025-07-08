import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import piscinasReducer from '../features/piscinas/piscinasSlice.js';
import usuariosReducer from '../features/usuarios/usuariosSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    piscinas: piscinasReducer,
    usuarios: usuariosReducer
  }
});
