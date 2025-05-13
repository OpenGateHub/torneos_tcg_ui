// src/components/CrearTorneo.jsx
import { useState,useContext } from 'react';
import { crearTorneo } from '../../services/torneosService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';

const CrearTorneo = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [tipo, setTipo] = useState('casual');
  const [fechaFin, setFechaFin] = useState(null);
  const [playoff, setPlayoff] = useState(0);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = auth
      const torneoData = {
        nombre,
        descripcion,
        fecha_inicio: fechaInicio,
        tipo,
        playoff
      };
      
      // Solo se agrega fecha_fin si existe
      if (fechaFin) {
        torneoData.fecha_fin = fechaFin;
      }

      await crearTorneo(torneoData, token);
      toast.success('Torneo creado correctamente');
      navigate('/torneos');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear el torneo');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Torneo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Torneo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Inicio</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Fin</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="casual">Casual</option>
            <option value="suizo">Suizo</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Playoff</label>
          <select 
            className="form-control" 
            value={playoff} 
            onChange={(e) => setPlayoff(parseInt(e.target.value))}
            required
          >
            <option value="0">Sin playoff</option>
            <option value="4">Top 4</option>
            <option value="8">Top 8</option>
            <option value="16">Top 16</option>
            <option value="32">Top 32</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Torneo
        </button>
      </form>
    </div>
  );
};

export default CrearTorneo;
