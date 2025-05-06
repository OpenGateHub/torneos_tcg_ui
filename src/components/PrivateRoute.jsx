import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);

  // Mientras se determina si el usuario está autenticado
  if (auth === null) {
    return null; // o un loader si querés
  }

  // Si no hay token, redirigir al login
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no es admin, redirigir al home
  if (auth.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Renderiza el componente si todo está bien
  return <Component {...rest} />;
};

export default PrivateRoute;
