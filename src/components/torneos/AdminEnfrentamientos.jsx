import { useEffect, useState, useContext } from 'react';
import { obtenerEnfrentamientos } from '../../services/torneosService';
import { registrarResultados, generarSiguienteRonda, finalizarTorneo } from '../../services/adminService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';

const AdminEnfrentamientos = ({ torneoId, rondasRecomendadas, setTorneo }) => {
  const [rondas, setRondas] = useState([]);
  const [resultadosLocales, setResultadosLocales] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarBotonSiguienteRonda, setMostrarBotonSiguienteRonda] = useState(false);
  const [torneoState, setTorneoState] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
        const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
          ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
        );
        setRondas(rondasOrdenadas);

        const ultimaRonda = rondasOrdenadas[rondasOrdenadas.length - 1][1];
        const todosFinalizados = ultimaRonda.every((match) => match.finalizado);
        setMostrarBotonSiguienteRonda(todosFinalizados);

        // Se habilita la edición si todos los enfrentamientos no están finalizados
      } catch (error) {
        toast.error('Error al obtener los enfrentamientos');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [torneoId]);

  const esUltimaRonda = (index) => index === rondas.length - 1;

  const handleSeleccion = (matchId, ganadorId, esEmpate = false) => {
    setResultadosLocales((prev) => ({
      ...prev,
      [matchId]: esEmpate ? { empate: true } : { ganadorId },
    }));
  };

  const estaSeleccionado = (matchId, jugadorId) => {
    return resultadosLocales[matchId]?.ganadorId === jugadorId;
  };

  const esEmpateSeleccionado = (matchId) => resultadosLocales[matchId]?.empate;

  const enviarResultados = async () => {
    const resultados = Object.entries(resultadosLocales).map(([id, resultado]) => ({
      enfrentamientoId: parseInt(id),
      ...resultado,
    }));

    if (resultados.length === 0) {
      toast.warning('No se seleccionaron resultados');
      return;
    }

    try {
      setGuardando(true);
      const respuesta = await registrarResultados(torneoId, { resultados }, auth);

      const todosOk = respuesta.resultados.every((r) => r.estado === 'ok');

      if (todosOk) {
        toast.success('Resultados guardados correctamente');
        setMostrarBotonSiguienteRonda(true);
      } else {
        toast.warning('Algunos resultados no se pudieron guardar');
      }

      const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
      const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
        ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
      );
      setRondas(rondasOrdenadas);
      setResultadosLocales({});
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar los resultados');
    } finally {
      setGuardando(false);
    }
  };

  const generarRonda = async () => {
    if (rondas.length >= rondasRecomendadas) {
      const confirmar = await Swal.fire({
        title: '¿Seguro quieres generar una nueva ronda?',
        html: `Estás a punto de generar una nueva ronda que superará las ${rondasRecomendadas} rondas recomendadas. ¿Deseas continuar?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });
  
      if (!confirmar.isConfirmed) return; 
    }
  
    try {
      setGuardando(true);
      await generarSiguienteRonda(torneoId, auth);
      toast.success('Siguiente ronda generada');
      setMostrarBotonSiguienteRonda(false);
  
      const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
      const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
        ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
      );
      setRondas(rondasOrdenadas);
    } catch (error) {
      console.error(error);
      toast.error('Error al generar la siguiente ronda');
    } finally {
      setGuardando(false);
    }
  };
  

  const confirmar = async () => {
    const result = await Swal.fire({
      title: '¿Finalizar torneo?',
      html: `Rondas actuales: <strong>${rondas.length}</strong><br>Rondas recomendadas: <strong>${rondasRecomendadas}</strong>.<br><br>¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    return result.isConfirmed;
  };

  const finalizarElTorneo = async () => {
    const continuar = await confirmar();
    if (!continuar) return;

    try {
      setGuardando(true);
      const respuesta = await finalizarTorneo(torneoId, { estado: 'cerrado' }, auth);
      if (respuesta.torneo.estado === 'cerrado') {
        toast.success('Torneo finalizado correctamente');
        setTorneoState((prev) => ({ ...prev, estado: 'cerrado' })); 

        setTorneo((prev) => ({ ...prev, estado: 'cerrado' }));
        window.location.reload();
      }
       else {
        toast.warning('No se pudo finalizar el torneo');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al finalizar el torneo');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando enfrentamientos...</p>;

  return (
    <div className="mt-4">
      <h4>Gestión de Enfrentamientos</h4>
      <div className="accordion" id="accordionAdminRondas">
        {rondas.map(([nombreRonda, enfrentamientos], index) => {
          const collapseId = `collapse-admin-${index}`;
          const headingId = `heading-admin-${index}`;
          const esUltima = esUltimaRonda(index);

          return (
            <div className="accordion-item" key={nombreRonda}>
              <h2 className="accordion-header" id={headingId}>
                <button
                  className={`accordion-button ${!esUltima ? 'collapsed' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded={esUltima ? 'true' : 'false'}
                  aria-controls={collapseId}
                >
                  {nombreRonda}
                </button>
              </h2>
              <div
                id={collapseId}
                className={`accordion-collapse collapse ${esUltima ? 'show' : ''}`}
                aria-labelledby={headingId}
                data-bs-parent="#accordionAdminRondas"
              >
                <div className="accordion-body p-0">
                  <ul className="list-group rounded-0">
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold bg-light">
                      ENFRENTAMIENTO <span>SELECCIÓN</span>
                    </li>
                    {enfrentamientos.map((match) => (
                      <li
                        key={match.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {match.jugador1?.nombre} vs {match.jugador2?.nombre || 'BYE'}
                        </span>

                        {esUltima ? (
                          match.jugador2 === null ? (
                            <span className="text-warning fw-bold">BYE</span>
                          ) : (
                            <div className="btn-group">
                              <button
                                className={`btn btn-sm ${
                                  estaSeleccionado(match.id, match.jugador1?.id)
                                    ? 'btn-success'
                                    : 'btn-outline-success'
                                }`}
                                onClick={() => handleSeleccion(match.id, match.jugador1?.id)}
                              >
                                {match.jugador1?.nombre}
                              </button>
                              <button
                                className={`btn btn-sm ${
                                  esEmpateSeleccionado(match.id)
                                    ? 'btn-warning'
                                    : 'btn-outline-warning'
                                }`}
                                onClick={() => handleSeleccion(match.id, null, true)}
                              >
                                Empate
                              </button>
                              <button
                                className={`btn btn-sm ${
                                  estaSeleccionado(match.id, match.jugador2?.id)
                                    ? 'btn-success'
                                    : 'btn-outline-success'
                                }`}
                                onClick={() => handleSeleccion(match.id, match.jugador2?.id)}
                              >
                                {match.jugador2?.nombre}
                              </button>
                            </div>
                          )
                        ) : (
                          <span>
                            {match.finalizado
                              ? match.jugador2 === null
                                ? 'BYE'
                                : match.ganador
                                ? `Ganador: ${match.ganador.nombre}`
                                : 'Empate'
                              : 'Pendiente'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn btn-primary mt-3" onClick={enviarResultados} disabled={guardando}>
        Guardar Resultados
      </button>

      <button className="btn btn-secondary mt-3 me-2" onClick={generarRonda} disabled={guardando || !mostrarBotonSiguienteRonda}>
        Generar siguiente ronda
      </button>

      <button className="btn btn-danger mt-3 ms-2" onClick={finalizarElTorneo} disabled={guardando}>
        Finalizar Torneo
      </button>
    </div>
  );
};

export default AdminEnfrentamientos;
