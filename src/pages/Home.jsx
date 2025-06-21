import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getTorneos } from "../services/torneosService";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";

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
                console.log(data);
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
        <div className="mx-auto container mt-5">
            <h1 className="text-2xl text-center mb-5">🎴 Torneos de Cartas</h1>
            <p className="text-center">
                ¡Explorá, participá y demostrá tus habilidades!
            </p>

            {!auth ? (
                <Button asChild className="mb-5">
                    <Link to="/crear-cuenta">Registrarse</Link>
                </Button>
            ) : (
                ""
            )}

            {/* Torneos activos */}
            <h2 className="mb-4 text-center">🔥 Proximos Torneos</h2>
            <div className="row justify-content-center">
                {cargando ? (
                    <div className="col-12">
                        <div>
                            <span>
                                Cargando torneos...
                            </span>
                        </div>
                    </div>
                ) : torneos?.torneosActivos?.length > 0 ? (
                    torneos?.torneosActivos?.map((torneo) => (
                        <div key={torneo.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-primary">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {torneo.nombre}
                                    </h5>
                                    <p className="card-text text-muted">
                                        {torneo.descripcion}
                                    </p>
                                    <p className="card-text">
                                        📅 Inicio:{" "}
                                        {new Date(
                                            torneo.fecha_inicio
                                        ).toLocaleDateString()}
                                    </p>
                                    <Link
                                        to={`/torneos/${torneo.id}`}
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <p className="text-gray-500 text-center">
                            No hay torneos disponibles por ahora. 😢
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
