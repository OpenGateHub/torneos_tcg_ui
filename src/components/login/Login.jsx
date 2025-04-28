import { useState } from 'react';
import { loginUsuario } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const esFormularioValido = () => {
    return email.includes('@') && password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
  
    try {
      await loginUsuario({ email, password });
      toast.success('¡Bienvenido de nuevo! 👋');
      navigate('/perfil');
    } catch (error) {
      console.error('Error en login:', error);

      const mensaje = error.response?.data?.mensaje || 'Error desconocido. Intenta nuevamente.';

      if (mensaje.includes('confirmar tu cuenta')) {
        toast.warning('Debes confirmar tu correo electrónico antes de iniciar sesión.');
      } else {
        toast.error('Credenciales incorrectas o cuenta inexistente.');
      }
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="container py-5">
      <h2>Iniciar sesión</h2>
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

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!esFormularioValido() || cargando}
        >
          {cargando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
