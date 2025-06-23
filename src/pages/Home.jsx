import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getTorneos } from "../services/torneosService";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Users, Trophy } from "lucide-react";

const Home = () => {
    const [torneos, setTorneos] = useState({
        torneosActivos: [],
        torneosFinalizados: [],
    });
    const [cargando, setCargando] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchTorneos = async () => {
            try {
                const data = await getTorneos();
                setTorneos(data);
            } catch (error) {
                console.error("Error al obtener torneos:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchTorneos();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-6 text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter">🎴 Torneos de Cartas</h1>
                <p className="text-lg text-muted-foreground">
                    ¡Explorá, participá y demostrá tus habilidades!
                </p>
                {!auth && (
                    <Button asChild size="lg" className="mt-4">
                        <Link to="/crear-cuenta">Comenzar Ahora</Link>
                    </Button>
                )}
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">🔥 Próximos Torneos</h2>
                </div>

                {cargando ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <CardHeader className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : torneos?.torneosActivos?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {torneos.torneosActivos.map((torneo) => (
                            <Card key={torneo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>{torneo.nombre}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {torneo.descripcion}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarDays className="h-4 w-4" />
                                        <span>
                                            {new Date(torneo.fecha_inicio).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <Trophy className="h-3 w-3" />
                                            {torneo.tipo || 'Standard'}
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {torneo.participantes || 0} jugadores
                                        </Badge>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link to={`/torneos/${torneo.id}`}>Ver detalles</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <CardContent>
                            <p className="text-muted-foreground">
                                No hay torneos disponibles por ahora. 😢
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Home;
