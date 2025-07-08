import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage.jsx';
import PiscinasListPage from './features/piscinas/PiscinasListPage.jsx';
import PiscinaFormPage from './features/piscinas/PiscinaFormPage.jsx';
import UsuariosListPage from './features/usuarios/UsuariosListPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/piscinas" element={
        <ProtectedRoute>
          <PiscinasListPage />
        </ProtectedRoute>
      } />
      <Route path="/piscinas/new" element={
        <ProtectedRoute>
          <PiscinaFormPage />
        </ProtectedRoute>
      } />
      <Route path="/piscinas/:id/edit" element={
        <ProtectedRoute>
          <PiscinaFormPage editMode />
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <UsuariosListPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
