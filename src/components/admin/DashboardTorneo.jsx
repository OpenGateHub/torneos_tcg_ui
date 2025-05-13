import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { obtenerTorneoPorId, cerrarInscripciones, generarPrimeraRonda,chequearPrimeraRonda,obtenerUsuarios,inscribirUsuario } from '../../services/adminService';
import AdminEnfrentamientos from '../torneos/AdminEnfrentamientos';
import Enfrentamientos from '../torneos/Enfrentamientos';

const DashboardTorneo = ({ token }) => {
  const { torneoId } = useParams(); 
  const [torneo, setTorneo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [hayPrimeraRonda, setHayPrimeraRonda] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (torneoId) {
      obtenerDatosTorneo();
      verificarPrimeraRonda();
    }
  }, [torneoId]);

  useEffect(() => {
    if (torneo) {
    cargarUsuarios();
    }
  }, [torneo]);

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
      obtenerDatosTorneo(); 
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
      await obtenerDatosTorneo(); 
      await verificarPrimeraRonda(); 
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error('Error al generar la primera ronda');
    }
  };
  const cargarUsuarios = async () => {
    try {
      const res = await obtenerUsuarios(token); 
      const noInscriptos = res.filter(u => !torneo.inscriptos.some(i => i.id === u.id));
      setUsuarios(noInscriptos);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };
  
  const inscribirUsuarios = async (usuarioId) => {
    try {
      await inscribirUsuario(torneoId, usuarioId); 
      toast.success('Usuario inscripto');
      obtenerDatosTorneo(); 
      cargarUsuarios();     
    } catch (error) {
      console.log(error);
      toast.error('No se pudo inscribir al usuario');
    }
  };
  
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

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
            <p><strong>Tipo:</strong> {torneo.torneo.tipo}</p>
            <p><strong>Playoff:</strong> {torneo.torneo.playoff}</p>
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
          <h2 className="accordion-header d-flex justify-content-between align-items-center" id="headingInscriptos">
            <button className="accordion-button w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInscriptos" aria-expanded="true" aria-controls="collapseInscriptos">
              Participantes ({torneo.inscriptos ? torneo.inscriptos.length : 0})
            </button>
            {torneo.torneo.estado === 'activo' && (
              <button className="btn btn-sm btn-success mx-2" data-bs-toggle="modal" data-bs-target="#modalAgregarParticipante">
                + Agregar Participante
              </button>
            )}
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
          <Enfrentamientos 
            torneoId={torneoId} 
            estado={torneo.torneo.estado}
            playoff={torneo.torneo.playoff}
          />
        )}
      {/* Modal para agregar participante */}
      {torneo.torneo.estado === 'activo' && (
      <div className="modal fade" id="modalAgregarParticipante" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">Agregar Participante</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <ul className="list-group">
                {usuariosFiltrados.map(usuario => (
                  <li key={usuario.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{usuario.nombre}</strong><br />
                      <small>{usuario.email}</small>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => inscribirUsuarios(usuario.id)}
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>

  );
};

export default DashboardTorneo;
