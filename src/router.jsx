import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Torneos from "./pages/Torneos";
import Profile from "./pages/profile";
import Login from "./components/login/Login";
import CrearCuenta from "./components/login/CrearCuenta";
import AdminLayout from "./components/layout/admin-layout";

import Torneo from "./pages/Torneo";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import UsuariosAdmin from "./components/admin/UsuariosAdmin";
import DashboardTorneo from "./components/admin/DashboardTorneo";
import CrearTorneo from "./components/torneos/CrearTorneo";
import { ConfirmAccount } from "@/pages/confirm-account";
import { ResetPassword } from "@/pages/reset-password";
import ForgotPassword from "@/pages/forgot-password";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { AdminHomePage } from "./pages/admin/home";
import { LeaguesPage } from "@/pages/admin/leagues";
import { TorneosPage } from "@/pages/admin/torneos";
import { LeagueDetailPage } from "./pages/admin/leagues-details";
import { LeagueTablePage } from "./pages/admin/leagues-position-table";
import { StorePage } from "./pages/store";
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
                        element={<ForgotPassword />}
                    />
                    <Route path="/perfil" element={<Profile />} />
                    <Route
                        path="/confirmar-cuenta/:token"
                        element={<ConfirmAccount />}
                    />
                    <Route
                        path="/restablecer-password/:token"
                        element={<ResetPassword />}
                    />

                    {/* Agregarás más rutas a medida que avances */}
                </Route>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="perfil" element={<Profile />} />
                    <Route
                        path=""
                        element={<PrivateRoute element={AdminHomePage} />}
                    />
                    <Route
                        path="old"
                        element={<PrivateRoute element={Admin} />}
                    />
                    <Route path="ligas" element={<LeaguesPage />} />
                    <Route
                        path="ligas/detalles/:id"
                        element={<LeagueDetailPage />}
                    />
                    <Route
                        path="ligas/:id/tabla"
                        element={<LeagueTablePage />}
                    />

                    <Route path="torneos" element={<TorneosPage />} />
                    <Route
                        path="torneos/crear"
                        element={<PrivateRoute element={CrearTorneo} />}
                    />
                    <Route
                        path="torneos/:torneoId"
                        element={<PrivateRoute element={DashboardTorneo} />}
                    />
                    <Route
                        path="usuarios"
                        element={<PrivateRoute element={UsuariosAdmin} />}
                    />
                    <Route
                        path="usuarios/:id"
                        element={<PrivateRoute element={UsuariosAdmin} />}
                    />
                    <Route
                        path="tienda"
                        element={<PrivateRoute element={StorePage} />}
                    />
                </Route>
            </Routes>
        </>
    );
};
