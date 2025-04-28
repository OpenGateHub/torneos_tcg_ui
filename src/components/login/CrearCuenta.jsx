import { useState } from 'react';
import { registrarUsuario } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const CrearCuenta = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const esFormularioValido = () => {
    return (
      nombre.trim() !== '' &&
      email.includes('@') &&
      password.length >= 8
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registrarUsuario({ nombre, email, password });
      toast.success('Confirma tu cuenta al correo que suministraste.');
      navigate('/login');
    } catch (error) {
      console.error('Error registrando usuario:', error);
      toast.error('Hubo un error al crear la cuenta. Revisa los datos.');
    }
  };

  return (
    <div className="container py-5">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

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
          <div className="form-text">Mínimo 6 caracteres.</div>
        </div>

        <button 
          type="submit" 
          className="btn btn-success"
          disabled={!esFormularioValido()}
        >
          Registrarme
        </button>
      </form>
    </div>
  );
};

export default CrearCuenta;
