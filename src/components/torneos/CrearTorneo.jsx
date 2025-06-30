// src/components/CrearTorneo.jsx
import { useState, useContext } from "react";

// thirdty part libraries
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//contexts
import AuthContext from "@/context/AuthContext";

// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// services
import { crearTorneo } from "@/services/torneosService";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useSession } from "@/hooks/use-session";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/api/queryKeys";

const CrearTorneo = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const leagueId = Number(queryParams.get("league"));
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [tipo, setTipo] = useState("casual");
    const [fechaFin, setFechaFin] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [playoff, setPlayoff] = useState(0);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const session = useSession();
    const queryClient = useQueryClient();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = auth;
            const torneoData = {
                nombre,
                descripcion,
                fecha_inicio: fechaInicio,
                tipo,
                playoff,
                companyId: session.data.user_company.company,
                leagueId,
            };

            // Solo se agrega fecha_fin si existe
            if (fechaFin) {
                torneoData.fecha_fin = fechaFin;
            }

            await crearTorneo(torneoData, token);
            toast.success("Torneo creado correctamente");
            navigate("/admin/ligas/detalles/" + leagueId);
            queryClient.invalidateQueries({
                queryKey: QueryKeys.TOURNAMENTS_LIST,
            });
        } catch (err) {
            console.error(err);
            toast.error("Error al crear el torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto my-8 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Crear Torneo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Nombre del Torneo</Label>
                            <Input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </Label>
                            <Textarea
                                rows="3"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Inicio</Label>
                            <Input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Fin</Label>
                            <Input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="casual">Casual</option>
                                <option value="suizo">Suizo</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Playoff
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                value={playoff}
                                onChange={(e) =>
                                    setPlayoff(parseInt(e.target.value))
                                }
                                required
                            >
                                <option value="0">Sin playoff</option>
                                <option value="4">Top 4</option>
                                <option value="8">Top 8</option>
                                <option value="16">Top 16</option>
                                <option value="32">Top 32</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full">
                            {isLoading ? "Creando torneo..." : "Crear torneo"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CrearTorneo;
