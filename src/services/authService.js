import clienteAxios from './axios';
import Cookies from 'js-cookie'; 


export const registrarUsuario = async (datos) => {
  await clienteAxios.post('/crear-cuenta', datos);
};


export const loginUsuario = async (datos) => {
  const response = await clienteAxios.post('/login', datos);
  const { token, usuario } = response.data;

  // Guardamos el token en una cookie
  Cookies.set('token', token, { expires: 1 }); // Expira en 1 día

  return { token, usuario }; 
};

export const solicitarTokenRecuperacion = async (data) => {
  try {
    const response = await clienteAxios.post(`/recuperar-password`, data);
    return response.data;
  } catch (error) {
    console.error('Error al solicitar token de recuperación:', error);
    throw error;
  }
};

export const reestablecerPassword = async (token, nuevaPassword) => {
  const response = await clienteAxios.put(`/restablecer-password/${token}`,
    { nuevaPassword }
  );
  return response.data;  // Devuelve la respuesta del backend
};


export const obtenerPerfil = async (token) => {
  const response = await clienteAxios.get('/perfil', {headers: {
    Authorization: `Bearer ${token}`,
  },
});
  return response.data;
};
