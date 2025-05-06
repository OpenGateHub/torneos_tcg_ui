import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTorneo, inscribirseEnTorneo } from '../services/torneosService'; // importa el servicio
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enfrentamientos from '../components/torneos/Enfrentamientos';

const Torneo = () => {
  const { id } = useParams();
  const [torneo, setTorneo] = useState(null);
  const [estaInscripto, setEstaInscripto] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const data = await getTorneo(id);
        setTorneo(data.torneo);
        setEstaInscripto(Boolean(data.estaInscripto));
      } catch (error) {
        console.log(error);
        toast.error('Error al obtener el torneo');
      } finally {
        setCargando(false);
      }
    };

    fetchTorneo();
  }, [id]);

  const toggleInscripcion = async () => {
    try {
      const data = await inscribirseEnTorneo(id);
      setEstaInscripto(prev => !prev);
      toast.success(data.mensaje);
    } catch (error) {
      console.log(error);
      toast.warning('Error al modificar inscripción');
    }
  };

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando torneo...</p>
      </div>
    );
  }

  if (!torneo) return null;

  return (
    <div className="container mt-4">
      <ToastContainer />

      <div className="card shadow p-4">
        <h2 className="mb-3 text-center">{torneo.nombre}</h2>
        <h5 className="text-muted">{torneo.descripcion}</h5>
        <p><strong>Fecha de inicio:</strong> {new Date(torneo.fecha_inicio).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {torneo.estado}</p>
        <p><strong>Participantes:</strong> {torneo.participantes}</p>

        {torneo.estado === 'activo' && (
          <button
            onClick={toggleInscripcion}
            className={`btn ${estaInscripto ? 'btn-danger' : 'btn-success'} mt-3`}
          >
            {estaInscripto ? 'Anular inscripción' : 'Inscribirme'}
          </button>
        )}
      </div>
      {['en progreso', 'cerrado'].includes(torneo.estado) && (
        <Enfrentamientos torneoId={id} />
      )}
    </div>
  );
};

export default Torneo;
