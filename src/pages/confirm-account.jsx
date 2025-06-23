// src/pages/ConfirmarCuenta.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { confirmarCuenta } from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";

export const ConfirmAccount = () => {
    const { token } = useParams();
    const [confirmado, setConfirmado] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const confirmar = async () => {
            try {
                const data = await confirmarCuenta(token);
                if (data.ok) {
                    toast.success(data.mensaje);
                    setConfirmado(true);
                } else {
                    toast.error(data.message || "Errir al confirmar cuenta");
                    setConfirmado(false);
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.mensaje || "Error al confirmar cuenta"
                );
                setConfirmado(false);
            } finally {
                setCargando(false);
            }
        };

        confirmar();
    }, [token]);

    if (cargando) {
        return (
            <div className="container text-center mt-5">
                <div>
                    <span className="visually-hidden">Confirmando...</span>
                </div>
                <p className="mt-3">Confirmando cuenta...</p>
            </div>
        );
    }

    return (
        <div className="container text-center mt-5">
            <ToastContainer />
            <h2 className="mb-3">
                {confirmado
                    ? "✅ Cuenta confirmada"
                    : "❌ No se pudo confirmar"}
            </h2>
            {confirmado ? (
                <Button asChild>
                    <Link to="/login">Iniciar sesión</Link>
                </Button>
            ) : (
                <Button asChild>
                    <Link to="/">Volver al inicio</Link>
                </Button>
            )}
        </div>
    );
};
