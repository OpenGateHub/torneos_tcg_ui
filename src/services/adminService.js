// src/services/adminService.js
import clienteAxios from './axios';

export const obtenerUsuarios = async (token) => {
  const { data } = await clienteAxios.get('/admin/usuarios', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const obtenerUsuario = async (id, token) => {
  const { data } = await clienteAxios.get(`/admin/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const cambiarRolUsuario = async (id, token) => {
  const { data } = await clienteAxios.put(`/admin/usuarios/${id}/rol`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const eliminarUsuario = async (id, token) => {
  const { data } = await clienteAxios.delete(`/admin/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};


export const obtenerTorneos = async (token) => {
  try {
    const { data } = await clienteAxios.get('/admin/torneos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data; 
  } catch (error) {
    console.error('Error al obtener los torneos:', error);
    throw new Error('No se pudieron obtener los torneos');
  }
};

export const obtenerTorneoPorId = async (id, token) => {
  const { data } = await clienteAxios.get(`/admin/torneos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const cerrarInscripciones = async (id, token) => {
  const { data } = await clienteAxios.put(`/admin/torneos/${id}`, 
    { estado: 'en progreso' }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
export const finalizarTorneo = async (id, token) => {
  const { data } = await clienteAxios.put(`/admin/torneos/${id}`, 
    { estado: 'cerrado' }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const generarPrimeraRonda = async (id, token) => {
  const { data } = await clienteAxios.post(`/admin/torneos/${id}/generarEnfrentamientos`, 
    {}, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const chequearPrimeraRonda = async (torneoId, token) => {
  try {
    const res = await clienteAxios.get(`/admin/torneos/${torneoId}/enfrentamientos/1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.ronda > 0; // true si hay enfrentamientos en ronda 1
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false; // Si no hay ronda 1, devolvemos false
    }
    throw error; 
  }
};


export const generarSiguienteRonda = async (id, token) => {
  const { data } = await clienteAxios.post(`/admin/torneos/${id}/siguiente-ronda`, 
    {}, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const registrarResultados = async (id, resultados, token) => {
  const { data } = await clienteAxios.post(`/admin/torneos/${id}/resultados`, 
    resultados, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};