import { useEffect, useState } from 'react';
import { obtenerEnfrentamientos, obtenerRanking } from '../../services/torneosService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';

const Enfrentamientos = ({ torneoId, estado, playoff }) => {
  const [rondas, setRondas] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
        const dataRanking = await obtenerRanking(torneoId);

        const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
          ([a], [b]) => Number(a.split(' ')[1]) - Number(b.split(' ')[1])
        );

        setRondas(rondasOrdenadas);
        setRanking(dataRanking || []);
      } catch (error) {
        toast.error('Error al obtener enfrentamientos o ranking');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    const torneoIniciado = estado !== 'activo';
    if (torneoIniciado) {
      cargarDatos();
    }
  }, [torneoId, estado]);

  if (cargando) return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Cargando datos del torneo...</span>
    </div>
  );

  const obtenerClaseTexto = (match) => {
    if (!match.finalizado) return '';
    if (match.jugador2 === null || !match.ganador) return 'text-yellow-500';
    return 'text-green-600';
  };

  const obtenerTextoResultado = (match) => {
    if (!match.finalizado) return 'Pendiente';
    if (match.jugador2 === null) return 'BYE';
    if (!match.ganador) return 'Empate';
    return `Ganador: ${match.ganador.nombre}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold mb-4">Enfrentamientos por Ronda</h4>
        <Accordion type="single" collapsible defaultValue={`item-${rondas.length - 1}`}>
          {rondas.map(([nombreRonda, enfrentamientos], index) => (
            <AccordionItem key={nombreRonda} value={`item-${index}`}>
              <AccordionTrigger className="px-4">{nombreRonda}</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="bg-muted/50 py-2">
                    <div className="flex justify-between items-center px-4 font-semibold">
                      <span>ENFRENTAMIENTO</span>
                      <span>RESULTADO</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {enfrentamientos.map((match) => (
                      <div
                        key={match.id}
                        className="flex justify-between items-center p-4 border-b last:border-b-0"
                      >
                        <span>
                          {!match.jugador2?.nombre ? 
                            match.jugador1?.nombre : 
                            `${match.jugador1?.nombre} vs ${match.jugador2?.nombre}`
                          }
                        </span>
                        <span className={obtenerClaseTexto(match)}>
                          <strong>{obtenerTextoResultado(match)}</strong>
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4">Ranking actual</h4>
        {playoff > 0 && (
          <Alert className="mb-4">
            <AlertDescription>
              Top {playoff} clasifican a playoffs
            </AlertDescription>
          </Alert>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead>Victorias</TableHead>
              <TableHead>Derrotas</TableHead>
              <TableHead>Empates</TableHead>
              <TableHead>Byes</TableHead>
              <TableHead>Puntos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((jugador, index) => (
              <TableRow 
                key={jugador.id}
                className={`
                  ${playoff > 0 && index + 1 <= playoff ? 'bg-muted/50' : ''}
                  ${playoff > 0 && index + 1 === playoff ? 'border-b-2 border-border' : ''}
                `}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {playoff > 0 && index + 1 <= playoff && (
                      <Badge variant="success">Playoff</Badge>
                    )}
                    {jugador.nombre}
                  </div>
                </TableCell>
                <TableCell>{jugador.victorias}</TableCell>
                <TableCell>{jugador.derrotas}</TableCell>
                <TableCell>{jugador.empates}</TableCell>
                <TableCell>{jugador.byes}</TableCell>
                <TableCell>{jugador.puntaje}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Enfrentamientos;
