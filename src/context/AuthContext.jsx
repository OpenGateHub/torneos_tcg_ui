import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Creamos el contexto
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cuando carga la app, buscamos el token en las cookies
    const token = Cookies.get('token');
    if (token) {
      setAuth({ token });
    }
  }, []);

  const login = (token) => {
    Cookies.set('token', token, { expires: 1 }); // 1 día de duración
    setAuth({ token });
    navigate('/'); // Redirigir a home tras login
  };

  const logout = () => {
    Cookies.remove('token');
    setAuth(null);
    navigate('/login'); // Redirigir a login tras logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
