import clienteAxios from './axios';
import Cookies from 'js-cookie'; 


export const registrarUsuario = async (datos) => {
  await clienteAxios.post('/crear-cuenta', datos);
};


export const loginUsuario = async (datos) => {
  const response = await clienteAxios.post('/login', datos);
  const { token } = response.data;

  // Guardamos el token en una cookie
  Cookies.set('token', token, { expires: 1 }); // Expira en 1 día
};


