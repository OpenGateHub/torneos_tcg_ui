// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Torneos TCG</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Siempre visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/torneos">Torneos</Link>
            </li>
          </ul>

          {/* Botones a la derecha */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {auth ? (
              // Si el usuario está logueado
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/perfil">Perfil</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              // Si NO está logueado
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/crear-cuenta">
                    Crear Cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
