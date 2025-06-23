import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = decodeJWT(token);
      const rol = decoded.rol;
      setAuth({ token, rol });
    }
  }, []);

  // Función para decodificar el JWT
  const decodeJWT = (token) => {
    const payload = token.split('.')[1]; // Obtener la parte del payload
    const decoded = atob(payload); // Decodificar de base64
    return JSON.parse(decoded); // Parsear el JSON decodificado
  };

  const login = (token) => {
    Cookies.set('token', token, { expires: 1 });
    const decoded = decodeJWT(token);
    const rol = decoded.rol;
    setAuth({ token, rol });
    window.localStorage.setItem('auth_token', token)
    navigate('/'); // Redirige a home
  };

  const logout = () => {
    Cookies.remove('token');
    setAuth(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
