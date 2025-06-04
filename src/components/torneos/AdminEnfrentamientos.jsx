import { useEffect, useState, useContext } from 'react';
import { obtenerEnfrentamientos } from '../../services/torneosService';
import { registrarResultados, generarSiguienteRonda, finalizarTorneo, registrarResultadoIndividual } from '../../services/adminService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';

const AdminEnfrentamientos = ({ torneoId, rondasRecomendadas, setTorneo }) => {
  const [rondas, setRondas] = useState([]);
  const [resultadosLocales, setResultadosLocales] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [puedeGenerarSiguienteRonda, setPuedeGenerarSiguienteRonda] = useState(false);
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
  
        // 1. Extraer resultados ya guardados en el servidor desde los enfrentamientos
        const resultadosDelServidor = {};
        rondasOrdenadas.forEach(([nombreRonda, enfrentamientos]) => {
          enfrentamientos.forEach(match => {
            if (match.estado === "finalizado") {
              if (match.ganador === null) {
                // Si no hay ganador, asumimos que es empate
                resultadosDelServidor[match.id] = { empate: true };
              } else {
                // Si hay ganador, guardamos su ID
                resultadosDelServidor[match.id] = { ganadorId: match.ganador.id };
              }
            }
          });
        });
  
        // 2. Cargar resultados pendientes desde localStorage
        const resultadosPendientes = JSON.parse(
          localStorage.getItem(`resultados_${torneoId}`) || '{}'
        );
  
        // 3. Combinar resultados del servidor con los pendientes
        // Los pendientes tienen prioridad (por si hay cambios no sincronizados)
        const resultadosCombinados = {
          ...resultadosDelServidor,
          ...resultadosPendientes
        };
  
        setResultadosLocales(resultadosCombinados);
  
        // 4. Verificar si puede generar siguiente ronda
        verificarSiPuedeGenerarSiguienteRonda(rondasOrdenadas, resultadosCombinados);
  
        // 5. Intentar sincronizar resultados pendientes si los hay
        if (Object.keys(resultadosPendientes).length > 0) {
          await sincronizarResultadosPendientes();
        }
  
      } catch (error) {
        toast.error('Error al obtener los enfrentamientos');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
  
    cargarDatos();
  }, [torneoId]);

  // Verificar si todos los enfrentamientos de la última ronda tienen resultados
  const verificarSiPuedeGenerarSiguienteRonda = (rondasData, resultados) => {
    if (rondasData.length === 0) return;
    
    const ultimaRonda = rondasData[rondasData.length - 1][1];
    const enfrentamientosConOponente = ultimaRonda.filter(match => match.jugador2 !== null);
    
    const todosConResultados = enfrentamientosConOponente.every(match => 
      resultados[match.id] && (resultados[match.id].ganadorId || resultados[match.id].empate)
    );
    
    setPuedeGenerarSiguienteRonda(todosConResultados);
  };

  const esUltimaRonda = (index) => index === rondas.length - 1;

  const handleSeleccion = async (matchId, ganadorId, esEmpate = false) => {
    const nuevoResultado = esEmpate ? { empate: true } : { ganadorId };
    
    // Guardar el estado anterior para poder revertir
    const estadoAnterior = { ...resultadosLocales };
    
    // Actualizar estado local optimistamente
    const nuevosResultados = {
      ...resultadosLocales,
      [matchId]: nuevoResultado,
    };
    
    setResultadosLocales(nuevosResultados);
  
    try {
      // Intentar guardar en el servidor
      await registrarResultadoIndividual(torneoId, matchId, nuevoResultado, auth);
      
      // Si se guarda correctamente, remover de localStorage pendientes
      const resultadosPendientes = JSON.parse(localStorage.getItem(`resultados_${torneoId}`) || '{}');
      delete resultadosPendientes[matchId];
      
      if (Object.keys(resultadosPendientes).length === 0) {
        localStorage.removeItem(`resultados_${torneoId}`);
      } else {
        localStorage.setItem(`resultados_${torneoId}`, JSON.stringify(resultadosPendientes));
      }
      
      // Verificar si puede generar siguiente ronda
      verificarSiPuedeGenerarSiguienteRonda(rondas, nuevosResultados);
      
    } catch (error) {
      console.error('Error al guardar resultado:', error);
      
      // Revertir al estado anterior
      setResultadosLocales(estadoAnterior);
      
      // Mantener en localStorage como pendiente
      const resultadosPendientes = JSON.parse(localStorage.getItem(`resultados_${torneoId}`) || '{}');
      resultadosPendientes[matchId] = nuevoResultado;
      localStorage.setItem(`resultados_${torneoId}`, JSON.stringify(resultadosPendientes));
      
      toast.error('Error al guardar el resultado. Se guardó localmente para reintento.');
    }
  };

  const estaSeleccionado = (matchId, jugadorId) => {
    return resultadosLocales[matchId]?.ganadorId === jugadorId;
  };

  const esEmpateSeleccionado = (matchId) => resultadosLocales[matchId]?.empate;

  const sincronizarResultadosPendientes = async () => {
    const resultadosPendientes = JSON.parse(localStorage.getItem(`resultados_${torneoId}`) || '{}');
    
    if (Object.keys(resultadosPendientes).length === 0) return;
    
    const resultadosExitosos = {};
    const resultadosFallidos = {};
    
    for (const [matchId, resultado] of Object.entries(resultadosPendientes)) {
      try {
        await registrarResultadoIndividual(torneoId, parseInt(matchId), resultado, auth);
        resultadosExitosos[matchId] = resultado;
      } catch (error) {
        console.error(`Error al sincronizar resultado ${matchId}:`, error);
        resultadosFallidos[matchId] = resultado;
      }
    }
    
    // Actualizar localStorage solo con los que fallaron
    if (Object.keys(resultadosFallidos).length === 0) {
      localStorage.removeItem(`resultados_${torneoId}`);
      toast.success('Todos los resultados pendientes se sincronizaron correctamente');
    } else {
      localStorage.setItem(`resultados_${torneoId}`, JSON.stringify(resultadosFallidos));
      const exitosos = Object.keys(resultadosExitosos).length;
      const fallidos = Object.keys(resultadosFallidos).length;
      toast.warning(`${exitosos} resultados sincronizados, ${fallidos} aún pendientes`);
    }
  };

  const generarSiguienteRondaConGuardado = async () => {
    // Primero verificar si estamos en la última ronda recomendada
    const esUltimaRondaRecomendada = rondas.length >= rondasRecomendadas;
    
    if (esUltimaRondaRecomendada) {
      // Si es la última ronda recomendada, finalizar torneo automáticamente
      await finalizarTorneoAutomaticamente();
      return;
    }

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
      
      // Primero guardar resultados
      const resultados = Object.entries(resultadosLocales).map(([id, resultado]) => ({
        enfrentamientoId: parseInt(id),
        ...resultado,
      }));

      if (resultados.length > 0) {
        await registrarResultados(torneoId, { resultados }, auth);
      }

      // Luego generar siguiente ronda
      await generarSiguienteRonda(torneoId, auth);
      toast.success('Resultados guardados y siguiente ronda generada');
      
      // Limpiar localStorage y estado local
      localStorage.removeItem(`resultados_${torneoId}`);
      setResultadosLocales({});
      setPuedeGenerarSiguienteRonda(false);
  
      // Recargar datos
      const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
      const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
        ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
      );
      setRondas(rondasOrdenadas);
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la siguiente ronda');
    } finally {
      setGuardando(false);
    }
  };

  const finalizarTorneoAutomaticamente = async () => {
    try {
      setGuardando(true);
      
      // Primero guardar resultados finales
      const resultados = Object.entries(resultadosLocales).map(([id, resultado]) => ({
        enfrentamientoId: parseInt(id),
        ...resultado,
      }));

      if (resultados.length > 0) {
        await registrarResultados(torneoId, { resultados }, auth);
      }

      // Finalizar torneo
      const respuesta = await finalizarTorneo(torneoId, auth);
      if (respuesta.torneo.estado === 'cerrado') {
        toast.success('Torneo finalizado automáticamente - Rondas completadas');
        localStorage.removeItem(`resultados_${torneoId}`);
        setTorneo((prev) => ({ ...prev, torneo: { ...prev.torneo, estado: 'cerrado' } }));
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al finalizar el torneo automáticamente');
    } finally {
      setGuardando(false);
    }
  };

  const finalizarElTorneoManual = async () => {
    const result = await Swal.fire({
      title: '¿Finalizar torneo?',
      html: `Rondas actuales: <strong>${rondas.length}</strong><br>Rondas recomendadas: <strong>${rondasRecomendadas}</strong>.<br><br>¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setGuardando(true);
      
      // Guardar resultados pendientes si los hay
      const resultados = Object.entries(resultadosLocales).map(([id, resultado]) => ({
        enfrentamientoId: parseInt(id),
        ...resultado,
      }));

      if (resultados.length > 0) {
        await registrarResultados(torneoId, { resultados }, auth);
      }

      const respuesta = await finalizarTorneo(torneoId, auth);
      if (respuesta.torneo.estado === 'cerrado') {
        toast.success('Torneo finalizado correctamente');
        localStorage.removeItem(`resultados_${torneoId}`);
        setTorneoState((prev) => ({ ...prev, estado: 'cerrado' })); 
        setTorneo((prev) => ({ ...prev, torneo: { ...prev.torneo, estado: 'cerrado' } }));
        window.location.reload();
      } else {
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
                          
                          {match.jugador2 === null ? (
                            match.jugador1?.nombre
                          ) : (
                            `${match.jugador1?.nombre} vs ${match.jugador2?.nombre}`
                          )}
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

      
      <button 
        className="btn btn-primary mt-3 me-2" 
        onClick={generarSiguienteRondaConGuardado} 
        disabled={guardando || !puedeGenerarSiguienteRonda}
      >
        {guardando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {rondas.length >= rondasRecomendadas ? 'Finalizando Torneo...' : 'Generando Siguiente Ronda...'}
          </>
        ) : (
          rondas.length >= rondasRecomendadas ? 'Finalizar Torneo' : 'Siguiente Ronda'
        )}
      </button>

      <button className="btn btn-danger mt-3 ms-2" onClick={finalizarElTorneoManual} disabled={guardando}>
        Finalizar Torneo (Manual)
      </button>
    </div>
  );
};

export default AdminEnfrentamientos;