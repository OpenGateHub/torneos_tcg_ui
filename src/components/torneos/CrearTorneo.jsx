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
  const [fechaFin, setFechaFin] = useState('');
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = auth
      await crearTorneo({ nombre, descripcion, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, token);
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Torneo
        </button>
      </form>
    </div>
  );
};

export default CrearTorneo;
