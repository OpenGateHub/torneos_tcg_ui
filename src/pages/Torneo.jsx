import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getTorneo, inscribirseEnTorneo } from '../services/torneosService';
import AuthContext from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enfrentamientos from '../components/torneos/Enfrentamientos';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Users, Trophy, AlertCircle } from "lucide-react";

const Torneo = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [torneo, setTorneo] = useState(null);
  const [estaInscripto, setEstaInscripto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesandoInscripcion, setProcesandoInscripcion] = useState(false);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const data = await getTorneo(id);
        setTorneo(data.torneo);
        setEstaInscripto(Boolean(data.estaInscripto));
      } catch (error) {
        console.log(error);
        toast.error('Error al obtener el torneo');
      } finally {
        setCargando(false);
      }
    };

    fetchTorneo();
  }, [id]);

  const toggleInscripcion = async () => {
    if (!auth) {
      toast.info('Debes estar logueado para inscribirte en el torneo.');
      return;
    }

    setProcesandoInscripcion(true);

    try {
      const promesaReal = inscribirseEnTorneo(id);
      const delayMinimo = new Promise(resolve => setTimeout(resolve, 2500));

      const [data] = await Promise.all([promesaReal, delayMinimo]);

      setEstaInscripto(prev => !prev);
      toast.success(data.mensaje);
    } catch (error) {
      console.log(error);
      toast.warning('Error al modificar inscripción');
    } finally {
      setProcesandoInscripcion(false);
    }
  };

  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!torneo) return null;

  const getBadgeColor = (estado) => {
    const colors = {
      'activo': 'bg-green-500',
      'en progreso': 'bg-blue-500',
      'cerrado': 'bg-red-500'
    };
    return colors[estado] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">{torneo.nombre}</CardTitle>
            <Badge className={getBadgeColor(torneo.estado)}>
              {torneo.estado.toUpperCase()}
            </Badge>
          </div>
          <CardDescription className="text-lg mt-2">{torneo.descripcion}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Fecha de inicio:</span>
              <span>{new Date(torneo.fecha_inicio).toLocaleDateString('es-AR')}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Tipo:</span>
              <span>{torneo.tipo}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Participantes:</span>
              <span>{torneo.participantes}</span>
            </div>
          </div>

          {torneo.estado === 'activo' && (
            <Button
              onClick={toggleInscripcion}
              variant={estaInscripto ? "destructive" : "default"}
              className="w-full mt-6"
              disabled={procesandoInscripcion}
            >
              {procesandoInscripcion ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {estaInscripto ? 'Anulando tu inscripción...' : 'Inscribiéndote al torneo...'}
                </>
              ) : (
                <>
                  {estaInscripto ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Cancelar inscripción
                    </>
                  ) : (
                    'Inscribirme'
                  )}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {['en progreso', 'cerrado'].includes(torneo.estado) && (
        <div className="mt-8">
          <Enfrentamientos
            torneoId={id}
            estado={torneo.estado}
            playoff={torneo.playoff}
          />
        </div>
      )}
    </div>
  );
};

export default Torneo;
