import { useState } from 'react';
import { toast } from 'react-toastify';
import { solicitarTokenRecuperacion } from '../../services/authService';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await solicitarTokenRecuperacion({ email });
      toast.success('Revisa tu correo para continuar con la recuperación.');
    } catch (error) {
      console.error(error);
      toast.error('No pudimos enviar el email. ¿Estás seguro que esa cuenta existe?');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </form>
    </div>
  );
};

export default OlvidePassword;
