// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Marca */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Torneos TCG
        </Link>

        {/* Menú hamburguesa para mobile */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-6">
                <Link to="/torneos" onClick={() => setOpen(false)}>Torneos</Link>
                {auth?.rol === "admin" && (
                  <Link to="/admin" onClick={() => setOpen(false)}>Dashboard</Link>
                )}
                {auth ? (
                  <>
                    <Link to="/perfil" onClick={() => setOpen(false)}>Perfil</Link>
                    <Button variant="destructive" onClick={() => { logout(); setOpen(false); }}>
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>Iniciar Sesión</Link>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link to="/crear-cuenta">Crear Cuenta</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Menú para pantallas grandes */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/torneos" className="text-sm text-gray-700 hover:text-gray-900">
            Torneos
          </Link>
          {auth?.rol === "admin" && (
            <Link to="/admin" className="text-sm text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {auth ? (
            <>
              <Link to="/perfil" className="text-sm text-gray-700 hover:text-gray-900">
                Perfil
              </Link>
              <Button variant="destructive" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
                Iniciar Sesión
              </Link>
              <Button asChild>
                <Link to="/crear-cuenta">Crear Cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
