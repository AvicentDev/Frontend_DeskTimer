// src/App.jsx

import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import GoogleCallback from './pages/GoogleCallback';      // ← Importa tu callback
import PrivateRoute from './routes/PrivateRoutes';
import { AdminRoute } from './routes/AdminRoute';

import DashboardPage from './pages/DashBoard';
import AdminSolicitudes from './features/solicitudes_entradaTiempo/Admin-Solicitudes/AdminSolicitudes';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Rutas protegidas (usuarios autenticados) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Rutas solo para administradores */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
