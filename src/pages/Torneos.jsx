import { useEffect, useState } from 'react';
import { getTorneos } from '../services/torneosService';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Trophy, ChevronRight } from "lucide-react";

const Torneos = () => {
  const [activos, setActivos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const res = await getTorneos();
        setActivos(res.torneosActivos);
        setFinalizados(res.torneosFinalizados);
      } catch (err) {
        console.error('Error al obtener torneos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTorneos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const TorneoCard = ({ torneo, isActive }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{torneo.nombre}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {torneo.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Inicio: {new Date(torneo.fecha_inicio).toLocaleDateString('es-AR')}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4" />
          <span>Tipo: {torneo.tipo}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link to={`/torneos/${torneo.id}`} className="flex items-center justify-center">
            Ver detalles
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-6">Torneos Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activos.map((torneo) => (
            <TorneoCard key={torneo.id} torneo={torneo} isActive={true} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Torneos Finalizados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalizados.map((torneo) => (
            <TorneoCard key={torneo.id} torneo={torneo} isActive={false} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Torneos;
