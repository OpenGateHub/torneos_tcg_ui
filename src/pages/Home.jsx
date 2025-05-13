import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTorneos } from '../services/torneosService';

const Home = () => {
  const [torneos, setTorneos] = useState({
    torneosActivos: [],
    torneosFinalizados: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const data  = await getTorneos();
        console.log(data);
        setTorneos(data);
      } catch (error) {
        console.error('Error al obtener torneos:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchTorneos();
  }, []);

  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 mb-3">🎴 Torneos de Cartas</h1>
      <p className="lead">¡Explorá, participá y demostrá tus habilidades!</p>

      <Link to="/registro" className="btn btn-primary btn-lg mt-3 mb-5">
        Registrarse
      </Link>

      {/* Torneos activos */}
      <h2 className="mb-4">🔥 Proximos Torneos</h2>
      <div className="row justify-content-center">
        {cargando ? (
          <div className="col-12">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando torneos...</span>
            </div>
          </div>
        ) : torneos?.torneosActivos?.length > 0 ? (
          torneos?.torneosActivos?.map((torneo) => (
            <div key={torneo.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-primary">
                <div className="card-body">
                  <h5 className="card-title">{torneo.nombre}</h5>
                  <p className="card-text text-muted">{torneo.descripcion}</p>
                  <p className="card-text">
                    📅 Inicio: {new Date(torneo.fecha_inicio).toLocaleDateString()}
                  </p>
                  <Link to={`/torneos/${torneo.id}`} className="btn btn-outline-primary btn-sm">
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted">No hay torneos disponibles por ahora. 😢</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
