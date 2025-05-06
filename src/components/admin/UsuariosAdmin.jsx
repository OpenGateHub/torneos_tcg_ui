import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { obtenerUsuarios} from '../../services/adminService';
import { Link } from 'react-router-dom';

const UsuariosAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await obtenerUsuarios(auth?.token);
      setUsuarios(response); // Asegurándote que sea el formato correcto
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error('Error al obtener los usuarios');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="d-flex flex-column p-6" style={{ height: '100vh' }}>
      <h1 className="text-3xl font-bold mb-4">Gestión de Usuarios</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="border p-2 w-full max-w-md mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="flex-grow-1 overflow-auto">
        {usuariosFiltrados.length === 0 ? (
          <p>No hay usuarios disponibles</p>
        ) : (
          <table className="w-100 table table-bordered">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rol</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(usuario => (
                <tr key={usuario.id}>
                  <td className="p-2">{usuario.nombre}</td>
                  <td className="p-2">{usuario.email}</td>
                  <td className="p-2 capitalize">{usuario.rol}</td>
                  <td className="p-2">
                    <Link
                      to={`/admin/usuarios/${usuario.id}`}
                      className="bg-primary text-white px-2 py-1 rounded"
                    >
                      Ver perfil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsuariosAdmin;
