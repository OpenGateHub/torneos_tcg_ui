import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { reestablecerPassword } from '../../services/authService'; 
import { toast } from 'react-toastify';

const RestablecerPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); 
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [cargando, setCargando] = useState(false);

  const esFormularioValido = () => {
    return nuevaContraseña === confirmarContraseña && nuevaContraseña.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esFormularioValido()) {
      toast.warning('Las contraseñas no coinciden o son demasiado cortas.');
      return;
    }

    setCargando(true);
    try {
      await reestablecerPassword(token, nuevaContraseña);
      toast.success('Contraseña actualizada exitosamente');
      setTimeout(() => navigate('/login',{ state: { mensaje: 'Contraseña actualizada' }}), 1500); 
    } catch (error) {
      toast.error('Hubo un error al restablecer la contraseña');
      console.error('Error al restablecer contraseña:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!esFormularioValido() || cargando}
        >
          {cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
};

export default RestablecerPassword;
