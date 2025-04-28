
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow-1 container py-4">
        <Outlet />
      </main>

      <footer className="bg-light text-center py-3 mt-auto">
        <small>&copy; 2025 Torneos de Cartas</small>
      </footer>
    </div>
  );
};

export default Layout;
