// src/pages/ConfirmarCuenta.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmarCuenta = () => {
  const { token } = useParams();
  const [confirmado, setConfirmado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const confirmar = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/confirmar/${token}`);
        toast.success(data.mensaje);
        setConfirmado(true);
      } catch (error) {
        toast.error(error.response?.data?.mensaje || 'Error al confirmar cuenta');
      } finally {
        setCargando(false);
      }
    };

    confirmar();
  }, [token]);

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Confirmando...</span>
        </div>
        <p className="mt-3">Confirmando cuenta...</p>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <ToastContainer />
      <h2 className="mb-3">{confirmado ? '✅ Cuenta confirmada' : '❌ No se pudo confirmar'}</h2>
      {confirmado ? (
        <Link className="btn btn-success" to="/login">Iniciar sesión</Link>
      ) : (
        <Link className="btn btn-secondary" to="/">Volver al inicio</Link>
      )}
    </div>
  );
};

export default ConfirmarCuenta;
