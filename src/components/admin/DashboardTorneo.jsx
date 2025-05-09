import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { obtenerTorneoPorId, cerrarInscripciones, generarPrimeraRonda,chequearPrimeraRonda } from '../../services/adminService';
import AdminEnfrentamientos from '../torneos/AdminEnfrentamientos';
import Enfrentamientos from '../torneos/Enfrentamientos';

const DashboardTorneo = ({ token }) => {
  const { torneoId } = useParams(); 
  const [torneo, setTorneo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [hayPrimeraRonda, setHayPrimeraRonda] = useState(false);

  useEffect(() => {
    if (torneoId) {
      obtenerDatosTorneo();
      verificarPrimeraRonda();
    }
  }, [torneoId]);

  const obtenerDatosTorneo = async () => {
    try {
      const datos = await obtenerTorneoPorId(torneoId, token);
      setTorneo(datos);;
    } catch (error) {
      console.log(error);
      toast.error('Error al cargar el torneo');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarInscripciones = async () => {
    try {
      await cerrarInscripciones(torneoId, token);
      toast.success('Inscripciones cerradas');
      obtenerDatosTorneo(); // recargar los datos
    } catch (error) {
      console.log(error);
      toast.error('No se pudo cerrar las inscripciones');
    }
  };

  const verificarPrimeraRonda = async () => {
    try {
      const existe = await chequearPrimeraRonda(torneoId, token);
      setHayPrimeraRonda(existe);
    } catch (error) {
      console.error('Error al verificar primera ronda:', error);
    }
  };
  


  const handleGenerarPrimeraRonda = async () => {
    try {
      await generarPrimeraRonda(torneoId, token);
      toast.success('Primera ronda generada');
      await obtenerDatosTorneo(); // recargar los datos
      await verificarPrimeraRonda(); // <- ¡ESTO ES CLAVE!
    } catch (error) {
      console.log(error);
      toast.error('Error al generar la primera ronda');
    }
  };

  if (cargando || !torneo) {
    return <div className="text-center mt-5">Cargando torneo...</div>;
  }
  return (
    <div className="container my-4">
      <h2 className="mb-4">Panel del Torneo</h2>

      {/* Resumen del torneo */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">{torneo.torneo.nombre}</h4>
          <p className="card-text">{torneo.torneo.descripcion}</p>
          <p className="card-text">
            <p><strong>Fecha de inicio:</strong> {new Date(torneo.torneo.fecha_inicio).toLocaleDateString('es-AR')}</p>
            <strong>Estado:</strong> {torneo.torneo.estado}
          </p>
          {torneo.torneo.estado === 'activo' && (
            <button className="btn btn-warning" onClick={handleCerrarInscripciones}>
              Cerrar Inscripciones
            </button>
          )}
          <p className="card-text">
            <strong>Rondas Recomendadas:</strong> {torneo.rondasRecomendadas}<br />
          </p>
        </div>
      </div>

      {/* Lista de inscriptos */}
      <div className="accordion mb-4" id="accordionInscriptos">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingInscriptos">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInscriptos" aria-expanded="true" aria-controls="collapseInscriptos">
              Participantes ({torneo.inscriptos ? torneo.inscriptos.length : 0})
            </button>
          </h2>
          <div id="collapseInscriptos" className="accordion-collapse collapse" aria-labelledby="headingInscriptos" data-bs-parent="#accordionInscriptos">
            <div className="accordion-body">
              {torneo.inscriptos && torneo.inscriptos.length > 0 ? (
                <ul className="list-group">
                  {torneo.inscriptos.map((usuario) => (
                    <li key={usuario.id} className="list-group-item">
                      <strong>{usuario.nombre}</strong> <br />
                      <span>{usuario.email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay usuarios inscriptos aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Botón para generar primera ronda */}
      {torneo.torneo.estado === 'en progreso' && (
        <div className="text-center mb-4">
          <button
            className="btn btn-primary"
            onClick={handleGenerarPrimeraRonda}
            disabled={hayPrimeraRonda}
          >
            {hayPrimeraRonda ? 'Primera Ronda Generada' : 'Generar Primera Ronda de Enfrentamientos'}
          </button>
        </div>
      )}

      {/* Componente de administración de enfrentamientos */}
        {torneo.torneo.estado === 'en progreso' && (
          <AdminEnfrentamientos torneoId={torneoId} token={token} setTorneo={setTorneo} estado={torneo.torneo.estado} rondasRecomendadas={torneo.rondasRecomendadas} />
        )}

        {torneo.torneo.estado === 'cerrado' && (
          <Enfrentamientos torneoId={torneoId} />
        )}
    </div>
  );
};

export default DashboardTorneo;
