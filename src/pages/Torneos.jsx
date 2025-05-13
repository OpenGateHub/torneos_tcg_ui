import { useEffect, useState } from 'react';
import { getTorneos } from '../services/torneosService';

import { Link } from 'react-router-dom';

const Torneos = () => {
  const [activos, setActivos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const res = await getTorneos();
        setActivos(res.torneosActivos);
        setFinalizados(res.torneosFinalizados);
      } catch (err) {
        console.error('Error al obtener torneos:', err);
      }
    };

    fetchTorneos();
  }, []);
  return (
    <div className="container py-4">
      <h2 className="mb-4">Torneos Activos</h2>
      <div className="row">
        {activos.map((torneo) => (
          <div className="col-md-6 mb-3" key={torneo.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{torneo.nombre}</h5>
                <p className="card-text">Inicio: {new Date(torneo.fecha_inicio).toLocaleDateString()}</p>
                <p className="card-text">Estado: {torneo.estado}</p>
                <p className="card-text">Tipo: {torneo.tipo}</p>
                <Link to={`/torneos/${torneo.id}`} className="btn btn-info">
                  Ver torneo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5 mb-4">Torneos finalizados</h2>
      <div className="row">
        {finalizados.map((torneo) => (
          <div className="col-md-6 mb-3" key={torneo.id}>
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">{torneo.nombre}</h5>
                <p className="card-text">Finalizó el: {new Date(torneo.fecha_fin).toLocaleDateString()}</p>
                <p className="card-text">Tipo: {torneo.tipo}</p>
                <Link to={`/torneos/${torneo.id}`} className="btn btn-info">
                  Ver torneo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Torneos;
