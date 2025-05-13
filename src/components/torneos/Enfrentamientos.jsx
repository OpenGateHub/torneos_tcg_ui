import { useEffect, useState } from 'react';
import { obtenerEnfrentamientos, obtenerRanking } from '../../services/torneosService';
import { toast } from 'react-toastify';

const Enfrentamientos = ({ torneoId, estado, playoff }) => {
  const [rondas, setRondas] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
        const dataRanking = await obtenerRanking(torneoId);

        const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
          ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
        );

        setRondas(rondasOrdenadas);
        setRanking(dataRanking || []);
      } catch (error) {
        toast.error('Error al obtener enfrentamientos o ranking');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    const torneoIniciado = estado !== 'activo';
    if (torneoIniciado) {
      cargarDatos();
    }
  }, [torneoId, estado]);

  if (cargando) return <p>Cargando datos del torneo...</p>;

  const obtenerClaseTexto = (match) => {
    if (!match.finalizado) return '';
    if (match.jugador2 === null || !match.ganador) return 'text-warning';
    return 'text-success';
  };

  const obtenerTextoResultado = (match) => {
    if (!match.finalizado) return 'Pendiente';
    if (match.jugador2 === null) return 'BYE';
    if (!match.ganador) return 'Empate';
    return `Ganador: ${match.ganador.nombre}`;
  };

  return (
    <div className="mt-4">
      <h4>Enfrentamientos por Ronda</h4>
      <div className="accordion" id="accordionRondas">
        {rondas.map(([nombreRonda, enfrentamientos], index) => {
          const collapseId = `collapse-${index}`;
          const headingId = `heading-${index}`;
          const isLast = index === rondas.length - 1;

          return (
            <div className="accordion-item" key={nombreRonda}>
              <h2 className="accordion-header" id={headingId}>
                <button
                  className={`accordion-button ${!isLast ? 'collapsed' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded={isLast ? 'true' : 'false'}
                  aria-controls={collapseId}
                >
                  {nombreRonda}
                </button>
              </h2>
              <div
                id={collapseId}
                className={`accordion-collapse collapse ${isLast ? 'show' : ''}`}
                aria-labelledby={headingId}
                data-bs-parent="#accordionRondas"
              >
                <div className="accordion-body p-0">
                  <ul className="list-group rounded-0">
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold bg-light">
                      ENFRENTAMIENTO<span>RESULTADO</span>
                    </li>
                    {enfrentamientos.map((match) => (
                      <li
                        key={match.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {match.jugador1?.nombre} vs {match.jugador2?.nombre || 'BYE'}
                        </span>
                        <span className={obtenerClaseTexto(match)}>
                          <strong>{obtenerTextoResultado(match)}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h4 className="mt-4">Ranking actual</h4>
      {playoff > 0 && (
        <div className="alert alert-info">
          Top {playoff} clasifican a playoffs
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>Victorias</th>
            <th>Derrotas</th>
            <th>Empates</th>
            <th>Byes</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((jugador, index) => (
            <tr 
              key={jugador.id}
              className={`
                ${playoff > 0 && index + 1 === playoff ? 'border-bottom ' : ''}
                ${playoff > 0 && index + 1 <= playoff ? 'border border-dark playoff-position' : ''}
              `}
            >
              <td>{index + 1}</td>
              <td>
                {playoff > 0 && index + 1 <= playoff && (
                  <span className="badge bg-success me-2">Playoff</span>
                )}
                {jugador.nombre}
              </td>
              <td>{jugador.victorias}</td>
              <td>{jugador.derrotas}</td>
              <td>{jugador.empates}</td>
              <td>{jugador.byes}</td>
              <td>{jugador.puntaje}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx="true">{`
        .playoff-position {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }
        .playoff-position:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default Enfrentamientos;
