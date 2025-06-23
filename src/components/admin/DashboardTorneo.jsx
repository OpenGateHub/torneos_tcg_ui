import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { obtenerTorneoPorId, cerrarInscripciones, generarPrimeraRonda, chequearPrimeraRonda, obtenerUsuarios, inscribirUsuario } from '../../services/adminService';
import AdminEnfrentamientos from '../torneos/AdminEnfrentamientos';
import Enfrentamientos from '../torneos/Enfrentamientos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Check, ChevronDown } from 'lucide-react';

const DashboardTorneo = ({ token }) => {
  const { torneoId } = useParams(); 
  const [torneo, setTorneo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [hayPrimeraRonda, setHayPrimeraRonda] = useState(false);
  const [generandoPrimeraRonda, setGenerandoPrimeraRonda] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [inscribiendoUsuario, setInscribiendoUsuario] = useState({});
  const [isParticipantesOpen, setIsParticipantesOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (torneoId) {
      obtenerDatosTorneo();
      verificarPrimeraRonda();
    }
  }, [torneoId]);

  useEffect(() => {
    if (torneo) {
      cargarUsuarios();
    }
  }, [torneo]);

  const obtenerDatosTorneo = async () => {
    try {
      const datos = await obtenerTorneoPorId(torneoId, token);
      setTorneo(datos);
    } catch (error) {
      console.log(error);
      toast.error('Error al cargar el torneo');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarInscripciones = async () => {
    try {
      await cerrarInscripciones(torneoId, token);
      toast.success('Inscripciones cerradas');
      obtenerDatosTorneo(); 
    } catch (error) {
      console.log(error);
      toast.error('No se pudo cerrar las inscripciones');
    }
  };

  const verificarPrimeraRonda = async () => {
    try {
      const existe = await chequearPrimeraRonda(torneoId, token);
      setHayPrimeraRonda(existe);
    } catch (error) {
      console.error('Error al verificar primera ronda:', error);
    }
  };

  const handleGenerarPrimeraRonda = async () => {
    setGenerandoPrimeraRonda(true);
    const delayMinimo = new Promise(resolve => setTimeout(resolve, 2500));
    try {
      const peticion = await generarPrimeraRonda(torneoId, token);
      await Promise.all([delayMinimo, peticion]);
      toast.success('Primera ronda generada');
      await obtenerDatosTorneo(); 
      await verificarPrimeraRonda(); 
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error('Error al generar la primera ronda');
    } finally {
      setGenerandoPrimeraRonda(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await obtenerUsuarios(token); 
      const noInscriptos = res.filter(u => !torneo.inscriptos.some(i => i.id === u.id));
      setUsuarios(noInscriptos);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const inscribirUsuarios = async (usuarioId) => {
    setInscribiendoUsuario(prev => ({ ...prev, [usuarioId]: 'loading' }));
    
    try {
      await inscribirUsuario(torneoId, usuarioId); 
      
      setInscribiendoUsuario(prev => ({ ...prev, [usuarioId]: 'success' }));
      
      toast.success('Usuario inscripto');
      obtenerDatosTorneo(); 
      cargarUsuarios();
      
      setTimeout(() => {
        setInscribiendoUsuario(prev => {
          const nuevo = { ...prev };
          delete nuevo[usuarioId];
          return nuevo;
        });
      }, 1500);
      
    } catch (error) {
      console.log(error);
      toast.error('No se pudo inscribir al usuario');
      
      setInscribiendoUsuario(prev => {
        const nuevo = { ...prev };
        delete nuevo[usuarioId];
        return nuevo;
      });
    }
  };
  
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderBotonInscripcion = (usuarioId) => {
    const estado = inscribiendoUsuario[usuarioId];
    
    if (estado === 'loading') {
      return (
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }
    
    if (estado === 'success') {
      return (
        <Button variant="default" size="sm" disabled className="bg-green-600 hover:bg-green-600">
          <Check className="h-4 w-4" />
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => inscribirUsuarios(usuarioId)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  };

  if (cargando || !torneo) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando torneo...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4 max-w-6xl">
      <h2 className="text-3xl font-bold mb-6">Panel del Torneo</h2>

      {/* Resumen del torneo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{torneo.torneo.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{torneo.torneo.descripcion}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold text-sm text-gray-500">Fecha de inicio</p>
              <p>{new Date(torneo.torneo.fecha_inicio).toLocaleDateString('es-AR')}</p>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-500">Estado</p>
              <Badge variant={torneo.torneo.estado === 'activo' ? 'default' : torneo.torneo.estado === 'en progreso' ? 'secondary' : 'outline'}>
                {torneo.torneo.estado}
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-500">Tipo</p>
              <p>{torneo.torneo.tipo}</p>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-500">Playoff</p>
              <p>{torneo.torneo.playoff}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm text-gray-500">Rondas Recomendadas</p>
            <p>{torneo.rondasRecomendadas}</p>
          </div>

          {torneo.torneo.estado === 'activo' && (
            <Button variant="destructive" onClick={handleCerrarInscripciones}>
              Cerrar Inscripciones
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Lista de inscriptos */}
      <Card className="mb-6">
        <Collapsible open={isParticipantesOpen} onOpenChange={setIsParticipantesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="flex items-center gap-2">
                  Participantes ({torneo.inscriptos ? torneo.inscriptos.length : 0})
                  <ChevronDown className={`h-4 w-4 transition-transform ${isParticipantesOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
                {torneo.torneo.estado === 'activo' && (
                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={(e) => e.stopPropagation()}>
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Participante
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {torneo.inscriptos && torneo.inscriptos.length > 0 ? (
                <div className="space-y-2">
                  {torneo.inscriptos.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{usuario.nombre}</p>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay usuarios inscriptos aún.</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Botón para generar primera ronda */}
      {torneo.torneo.estado === 'en progreso' && (
        <div className={`text-center mb-6 ${hayPrimeraRonda ? 'hidden' : ''}`}>
          <Button
            size="lg"
            onClick={handleGenerarPrimeraRonda}
            disabled={hayPrimeraRonda || generandoPrimeraRonda}
          >
            {generandoPrimeraRonda ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generando Primera Ronda...
              </>
            ) : (
              hayPrimeraRonda
                ? 'Primera Ronda Generada'
                : 'Generar Primera Ronda de Enfrentamientos'
            )}
          </Button>
        </div>
      )}

      {/* Componente de administración de enfrentamientos */}
      {torneo.torneo.estado === 'en progreso' && (
        <AdminEnfrentamientos 
          torneoId={torneoId} 
          token={token} 
          setTorneo={setTorneo} 
          estado={torneo.torneo.estado} 
          rondasRecomendadas={torneo.rondasRecomendadas} 
        />
      )}

      {torneo.torneo.estado === 'cerrado' && (
        <Enfrentamientos 
          torneoId={torneoId} 
          estado={torneo.torneo.estado}
          playoff={torneo.torneo.playoff}
        />
      )}

      {/* Modal para agregar participante */}
      {torneo.torneo.estado === 'activo' && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Participante</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <div className="max-h-96 overflow-y-auto space-y-2">
                {usuariosFiltrados.map(usuario => (
                  <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{usuario.nombre}</p>
                      <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                    {renderBotonInscripcion(usuario.id)}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardTorneo;