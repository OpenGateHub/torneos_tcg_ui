// torneosService.js
import clienteAxios from './axios';

// Crear un nuevo torneo
export const crearTorneo = async (datos, token) => {
  const { data } = await clienteAxios.post('/admin/torneos', datos, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};


// Obtener todos los torneos
export const getTorneos = async () => {
  const { data } = await clienteAxios.get('/torneos');
  return data;
};

// Obtener un torneo por ID
export const getTorneo = async (id) => {
  const { data } = await clienteAxios.get(`/torneos/${id}`);
  return data;
};

// Inscribirse en un torneo
export const inscribirseEnTorneo = async (id) => {
  const { data } = await clienteAxios.post(`/torneos/${id}/inscribirse`);
  return data;
};

export const obtenerEnfrentamientos = async (id) => {
  const { data } = await clienteAxios.get(`/torneos/${id}/enfrentamientos`);
  return data;
};

export const obtenerRanking = async (id) => {
  const { data } = await clienteAxios.get(`/torneos/${id}/ranking`);
  return data;
};