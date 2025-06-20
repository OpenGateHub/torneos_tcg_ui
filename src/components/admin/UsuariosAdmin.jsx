import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { obtenerUsuarios } from '../../services/adminService';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User, Mail, Shield } from 'lucide-react';

const UsuariosAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await obtenerUsuarios(auth?.token);
      setUsuarios(response);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error('Error al obtener los usuarios');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="pl-10"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Lista de Usuarios ({usuariosFiltrados.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {usuariosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No hay usuarios disponibles</p>
              <p className="text-gray-400 text-sm">
                {busqueda ? 'Intenta con otros términos de búsqueda' : 'No se encontraron usuarios en el sistema'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Nombre</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Rol</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosFiltrados.map(usuario => (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button asChild variant="default" size="sm">
                          <Link to={`/admin/usuarios/${usuario.id}`}>
                            Ver perfil
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosAdmin;