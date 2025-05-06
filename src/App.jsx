// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import Perfil from './pages/Perfil';
import Login from './components/login/Login';
import CrearCuenta from './components/login/CrearCuenta';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Torneo from './pages/Torneo';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import UsuariosAdmin from './components/admin/UsuariosAdmin';
import DashboardTorneo from './components/admin/DashboardTorneo';
import CrearTorneo from './components/torneos/CrearTorneo';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/torneos" element={<Torneos />} />
            <Route path="/torneos/:id" element={<Torneo />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute element={Admin} />} />
            <Route path="/admin/torneos/crear" element={<PrivateRoute element={CrearTorneo} />} />
            <Route path="/admin/usuarios" element={<PrivateRoute element={UsuariosAdmin} />} />
            <Route path="/admin/torneos/:torneoId" element={<PrivateRoute element={DashboardTorneo} />} />

            {/* Agregarás más rutas a medida que avances */}
          </Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
