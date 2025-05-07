import { useEffect, useState, useContext } from 'react';
import { obtenerPerfil } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Perfil = () => {
  const { auth } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token) {
      console.log('no hay token');
      navigate('/login');
      return;
    }

    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfil(auth?.token);
        setUsuario(data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    cargarPerfil();
  }, [navigate, auth?.token]);

  if (!usuario) return <p className="text-center mt-4">Cargando perfil...</p>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {usuario.usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.usuario.email}</p>
      <p><strong>Miembro desde:</strong> {new Date(usuario.usuario.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default Perfil;
