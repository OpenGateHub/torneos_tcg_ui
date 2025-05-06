import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { obtenerTorneos } from '../../services/adminService';
import { Link } from 'react-router-dom';

const TorneosAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [activos, setActivos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);

  useEffect(() => {
    const cargarTorneos = async () => {
      try {
        const data = await obtenerTorneos(auth?.token);
        setActivos(data.torneosActivos || []);
        setFinalizados(data.torneosFinalizados || []);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener los torneos');
      }
    };
    cargarTorneos();
  }, []);

  const renderTabla = (torneos, titulo) => (
    <div className="mb-5">
      <h2 className="h4 mb-3">{titulo}</h2>
      {torneos.length === 0 ? (
        <p>No hay torneos</p>
      ) : (
        <table className="table table-bordered table-striped w-100">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Fecha de Inicio</th>
              <th>Participantes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {torneos.map((torneo) => (
              <tr key={torneo.id}>
                <td>{torneo.nombre}</td>
                <td>{new Date(torneo.fecha_inicio).toLocaleDateString()}</td>
                <td>{torneo.participantes || 0}</td>
                <td className="text-capitalize">{torneo.estado}</td>
                <td>
                  <Link
                    to={`/admin/torneos/${torneo.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Gestión de Torneos</h1>
      <Link to="/admin/torneos/crear" className="btn btn-success mb-4">
        Crear Torneo
      </Link>
      {renderTabla(activos, 'Torneos Activos')}
      {renderTabla(finalizados, 'Torneos Finalizados')}
    </div>
  );
};

export default TorneosAdmin;
