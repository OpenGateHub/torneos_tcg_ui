import { Routes, Route } from 'react-router-dom';

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Torneos from "./pages/Torneos";
import Perfil from "./pages/Perfil";
import Login from "./components/login/Login";
import CrearCuenta from "./components/login/CrearCuenta";

import Torneo from "./pages/Torneo";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import UsuariosAdmin from "./components/admin/UsuariosAdmin";
import DashboardTorneo from "./components/admin/DashboardTorneo";
import CrearTorneo from "./components/torneos/CrearTorneo";
import ConfirmarCuenta from "./components/login/ConfirmarCuenta";
import ReestablecerPassword from "./components/login/RestablecerPassword";
import OlvidePassword from "./components/login/OlvidePassword";
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    {/**Torneos */}
                    <Route path="/torneos" element={<Torneos />} />
                    <Route path="/torneos/:id" element={<Torneo />} />
                    {/**Auth */}
                    <Route path="/crear-cuenta" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/olvide-password"
                        element={<OlvidePassword />}
                    />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route
                        path="/confirmar-cuenta/:token"
                        element={<ConfirmarCuenta />}
                    />
                    <Route
                        path="/restablecer-password/:token"
                        element={<ReestablecerPassword />}
                    />
                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={<PrivateRoute element={Admin} />}
                    />
                    <Route
                        path="/admin/torneos/crear"
                        element={<PrivateRoute element={CrearTorneo} />}
                    />
                    <Route
                        path="/admin/usuarios"
                        element={<PrivateRoute element={UsuariosAdmin} />}
                    />
                    <Route
                        path="/admin/torneos/:torneoId"
                        element={<PrivateRoute element={DashboardTorneo} />}
                    />

                    {/* Agregarás más rutas a medida que avances */}
                </Route>
            </Routes>
        </>
    );
};
