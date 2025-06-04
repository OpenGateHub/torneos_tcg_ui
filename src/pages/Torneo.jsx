import { useParams } from 'react-router-dom';
import { useEffect, useState,useContext } from 'react';
import { getTorneo, inscribirseEnTorneo } from '../services/torneosService'; // importa el servicio
import AuthContext from '../context/AuthContext';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enfrentamientos from '../components/torneos/Enfrentamientos';

const Torneo = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [torneo, setTorneo] = useState(null);
  const [estaInscripto, setEstaInscripto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesandoInscripcion, setProcesandoInscripcion] = useState(false);


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
    if (!auth) {
      toast.info('Debes estar logueado para inscribirte en el torneo.');
      return;
    }

    setProcesandoInscripcion(true);

  
    try {
      const promesaReal = inscribirseEnTorneo(id);
      const delayMinimo = new Promise(resolve => setTimeout(resolve, 2500));

      const [data] = await Promise.all([promesaReal, delayMinimo]);

      setEstaInscripto(prev => !prev);
      toast.success(data.mensaje);
    } catch (error) {
      console.log(error);
      toast.warning('Error al modificar inscripción');
    } finally {
      setProcesandoInscripcion(false);
    }
  };
  

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Cargando torneo...</span>
        </div>
        <p className="mt-3 fs-4 text-muted">Cargando torneo...</p>
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
        <p><strong>Fecha de inicio:</strong> {new Date(torneo.fecha_inicio).toLocaleDateString('es-AR')}</p>
        <p><strong>Tipo:</strong> {torneo.tipo}</p>
        <p><strong>Estado:</strong> {torneo.estado}</p>
        <p><strong>Participantes:</strong> {torneo.participantes}</p>

        {torneo.estado === 'activo' && (
          <button
          onClick={toggleInscripcion}
          className={`btn ${estaInscripto ? 'btn-danger' : 'btn-success'} mt-3`}
          disabled={procesandoInscripcion}
        >
          {procesandoInscripcion ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {estaInscripto ? 'Anulando tu inscripción...' : 'Inscribiéndote al torneo...'}
            </>
          ) : (
            estaInscripto 
              ? 'Ya estás inscripto, para cancelar tu inscripción haz clic aquí'
              : 'Inscribirme'
          )}
        </button>
        )}
      </div>
      {['en progreso', 'cerrado'].includes(torneo.estado) && (
        <Enfrentamientos 
          torneoId={id} 
          estado={torneo.estado}
          playoff={torneo.playoff}
        />
      )}
    </div>
  );
};

export default Torneo;
