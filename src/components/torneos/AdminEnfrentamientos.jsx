import { useEffect, useState, useContext } from "react";
import { obtenerEnfrentamientos } from "../../services/torneosService";
import {
    registrarResultados,
    generarSiguienteRonda,
    finalizarTorneo,
    registrarResultadoIndividual,
} from "../../services/adminService";
import { toast } from "react-toastify";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AuthContext from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";
import Swal from "sweetalert2";

const AdminEnfrentamientos = ({ torneoId, rondasRecomendadas, setTorneo }) => {
    const [rondas, setRondas] = useState([]);
    const [resultadosLocales, setResultadosLocales] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [puedeGenerarSiguienteRonda, setPuedeGenerarSiguienteRonda] =
        useState(false);
    const [torneoState, setTorneoState] = useState(null);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataEnfrentamientos = await obtenerEnfrentamientos(
                    torneoId
                );
                const rondasOrdenadas = Object.entries(
                    dataEnfrentamientos
                ).sort(
                    ([a], [b]) =>
                        Number(a.split(" ")[1]) - Number(b.split(" ")[1])
                );
                setRondas(rondasOrdenadas);

                // 1. Extraer resultados ya guardados en el servidor desde los enfrentamientos
                const resultadosDelServidor = {};
                rondasOrdenadas.forEach(([nombreRonda, enfrentamientos]) => {
                    enfrentamientos.forEach((match) => {
                        if (match.estado === "finalizado") {
                            if (match.ganador === null) {
                                // Si no hay ganador, asumimos que es empate
                                resultadosDelServidor[match.id] = {
                                    empate: true,
                                };
                            } else {
                                // Si hay ganador, guardamos su ID
                                resultadosDelServidor[match.id] = {
                                    ganadorId: match.ganador.id,
                                };
                            }
                        }
                    });
                });

                // 2. Cargar resultados pendientes desde localStorage
                const resultadosPendientes = JSON.parse(
                    localStorage.getItem(`resultados_${torneoId}`) || "{}"
                );

                // 3. Combinar resultados del servidor con los pendientes
                // Los pendientes tienen prioridad (por si hay cambios no sincronizados)
                const resultadosCombinados = {
                    ...resultadosDelServidor,
                    ...resultadosPendientes,
                };

                setResultadosLocales(resultadosCombinados);

                // 4. Verificar si puede generar siguiente ronda
                verificarSiPuedeGenerarSiguienteRonda(
                    rondasOrdenadas,
                    resultadosCombinados
                );

                // 5. Intentar sincronizar resultados pendientes si los hay
                if (Object.keys(resultadosPendientes).length > 0) {
                    await sincronizarResultadosPendientes();
                }
            } catch (error) {
                toast.error("Error al obtener los enfrentamientos");
                console.error(error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [torneoId]);

    // Verificar si todos los enfrentamientos de la última ronda tienen resultados
    const verificarSiPuedeGenerarSiguienteRonda = (rondasData, resultados) => {
        if (rondasData.length === 0) return;

        const ultimaRonda = rondasData[rondasData.length - 1][1];
        const enfrentamientosConOponente = ultimaRonda.filter(
            (match) => match.jugador2 !== null
        );

        const todosConResultados = enfrentamientosConOponente.every(
            (match) =>
                resultados[match.id] &&
                (resultados[match.id].ganadorId || resultados[match.id].empate)
        );

        setPuedeGenerarSiguienteRonda(todosConResultados);
    };

    const esUltimaRonda = (index) => index === rondas.length - 1;

    const handleSeleccion = async (matchId, ganadorId, esEmpate = false) => {
        const nuevoResultado = esEmpate ? { empate: true } : { ganadorId };

        // Guardar el estado anterior para poder revertir
        const estadoAnterior = { ...resultadosLocales };

        // Actualizar estado local optimistamente
        const nuevosResultados = {
            ...resultadosLocales,
            [matchId]: nuevoResultado,
        };

        setResultadosLocales(nuevosResultados);

        try {
            // Intentar guardar en el servidor
            await registrarResultadoIndividual(
                torneoId,
                matchId,
                nuevoResultado,
                auth
            );

            // Si se guarda correctamente, remover de localStorage pendientes
            const resultadosPendientes = JSON.parse(
                localStorage.getItem(`resultados_${torneoId}`) || "{}"
            );
            delete resultadosPendientes[matchId];

            if (Object.keys(resultadosPendientes).length === 0) {
                localStorage.removeItem(`resultados_${torneoId}`);
            } else {
                localStorage.setItem(
                    `resultados_${torneoId}`,
                    JSON.stringify(resultadosPendientes)
                );
            }

            // Verificar si puede generar siguiente ronda
            verificarSiPuedeGenerarSiguienteRonda(rondas, nuevosResultados);
        } catch (error) {
            console.error("Error al guardar resultado:", error);

            // Revertir al estado anterior
            setResultadosLocales(estadoAnterior);

            // Mantener en localStorage como pendiente
            const resultadosPendientes = JSON.parse(
                localStorage.getItem(`resultados_${torneoId}`) || "{}"
            );
            resultadosPendientes[matchId] = nuevoResultado;
            localStorage.setItem(
                `resultados_${torneoId}`,
                JSON.stringify(resultadosPendientes)
            );

            toast.error(
                "Error al guardar el resultado. Se guardó localmente para reintento."
            );
        }
    };

    const estaSeleccionado = (matchId, jugadorId) => {
        return resultadosLocales[matchId]?.ganadorId === jugadorId;
    };

    const esEmpateSeleccionado = (matchId) =>
        resultadosLocales[matchId]?.empate;

    const sincronizarResultadosPendientes = async () => {
        const resultadosPendientes = JSON.parse(
            localStorage.getItem(`resultados_${torneoId}`) || "{}"
        );

        if (Object.keys(resultadosPendientes).length === 0) return;

        const resultadosExitosos = {};
        const resultadosFallidos = {};

        for (const [matchId, resultado] of Object.entries(
            resultadosPendientes
        )) {
            try {
                await registrarResultadoIndividual(
                    torneoId,
                    parseInt(matchId),
                    resultado,
                    auth
                );
                resultadosExitosos[matchId] = resultado;
            } catch (error) {
                console.error(
                    `Error al sincronizar resultado ${matchId}:`,
                    error
                );
                resultadosFallidos[matchId] = resultado;
            }
        }

        // Actualizar localStorage solo con los que fallaron
        if (Object.keys(resultadosFallidos).length === 0) {
            localStorage.removeItem(`resultados_${torneoId}`);
            toast.success(
                "Todos los resultados pendientes se sincronizaron correctamente"
            );
        } else {
            localStorage.setItem(
                `resultados_${torneoId}`,
                JSON.stringify(resultadosFallidos)
            );
            const exitosos = Object.keys(resultadosExitosos).length;
            const fallidos = Object.keys(resultadosFallidos).length;
            toast.warning(
                `${exitosos} resultados sincronizados, ${fallidos} aún pendientes`
            );
        }
    };

    const generarSiguienteRondaConGuardado = async () => {
        // Primero verificar si estamos en la última ronda recomendada
        const esUltimaRondaRecomendada = rondas.length >= rondasRecomendadas;

        if (esUltimaRondaRecomendada) {
            // Si es la última ronda recomendada, finalizar torneo automáticamente
            await finalizarTorneoAutomaticamente();
            return;
        }

        if (rondas.length >= rondasRecomendadas) {
            const confirmar = await Swal.fire({
                title: "¿Seguro quieres generar una nueva ronda?",
                html: `Estás a punto de generar una nueva ronda que superará las ${rondasRecomendadas} rondas recomendadas. ¿Deseas continuar?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, generar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            });

            if (!confirmar.isConfirmed) return;
        }

        try {
            setGuardando(true);

            // Primero guardar resultados
            const resultados = Object.entries(resultadosLocales).map(
                ([id, resultado]) => ({
                    enfrentamientoId: parseInt(id),
                    ...resultado,
                })
            );

            if (resultados.length > 0) {
                await registrarResultados(torneoId, { resultados }, auth);
            }

            // Luego generar siguiente ronda
            await generarSiguienteRonda(torneoId, auth);
            toast.success("Resultados guardados y siguiente ronda generada");

            // Limpiar localStorage y estado local
            localStorage.removeItem(`resultados_${torneoId}`);
            setResultadosLocales({});
            setPuedeGenerarSiguienteRonda(false);

            // Recargar datos
            const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
            const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
                ([a], [b]) => Number(a.split(" ")[1]) - Number(b.split(" ")[1])
            );
            setRondas(rondasOrdenadas);
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la siguiente ronda");
        } finally {
            setGuardando(false);
        }
    };

    const finalizarTorneoAutomaticamente = async () => {
        try {
            setGuardando(true);

            // Primero guardar resultados finales
            const resultados = Object.entries(resultadosLocales).map(
                ([id, resultado]) => ({
                    enfrentamientoId: parseInt(id),
                    ...resultado,
                })
            );

            if (resultados.length > 0) {
                await registrarResultados(torneoId, { resultados }, auth);
            }

            // Finalizar torneo
            const respuesta = await finalizarTorneo(torneoId, auth);
            if (respuesta.torneo.estado === "cerrado") {
                toast.success(
                    "Torneo finalizado automáticamente - Rondas completadas"
                );
                localStorage.removeItem(`resultados_${torneoId}`);
                setTorneo((prev) => ({
                    ...prev,
                    torneo: { ...prev.torneo, estado: "cerrado" },
                }));
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al finalizar el torneo automáticamente");
        } finally {
            setGuardando(false);
        }
    };

    const finalizarElTorneoManual = async () => {
        const result = await Swal.fire({
            title: "¿Finalizar torneo?",
            html: `Rondas actuales: <strong>${rondas.length}</strong><br>Rondas recomendadas: <strong>${rondasRecomendadas}</strong>.<br><br>¿Deseas continuar?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, finalizar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            setGuardando(true);

            // Guardar resultados pendientes si los hay
            const resultados = Object.entries(resultadosLocales).map(
                ([id, resultado]) => ({
                    enfrentamientoId: parseInt(id),
                    ...resultado,
                })
            );

            if (resultados.length > 0) {
                await registrarResultados(torneoId, { resultados }, auth);
            }

            const respuesta = await finalizarTorneo(torneoId, auth);
            if (respuesta.torneo.estado === "cerrado") {
                toast.success("Torneo finalizado correctamente");
                localStorage.removeItem(`resultados_${torneoId}`);
                setTorneoState((prev) => ({ ...prev, estado: "cerrado" }));
                setTorneo((prev) => ({
                    ...prev,
                    torneo: { ...prev.torneo, estado: "cerrado" },
                }));
                window.location.reload();
            } else {
                toast.warning("No se pudo finalizar el torneo");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al finalizar el torneo");
        } finally {
            setGuardando(false);
        }
    };

    const onEditRound = async (numberRound) => {
        const result = await Swal.fire({
            title: "¿Seguro que quieres editar esta ronda?",
            html: "Esta acción descartaria la ronda mas reciente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#d33'
        });
        if (result.isConfirmed) {
            axiosClient
                .get(apiUrls.rounds.open(torneoId, numberRound))
                .then(() => {
                    refreshData();
                });
        }
    };

    const refreshData = async () => {
        // Recargar datos
        const dataEnfrentamientos = await obtenerEnfrentamientos(torneoId);
        const rondasOrdenadas = Object.entries(dataEnfrentamientos).sort(
            ([a], [b]) => Number(a.split(" ")[1]) - Number(b.split(" ")[1])
        );
        setRondas(rondasOrdenadas);
    };

    if (cargando)
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando enfrentamientos...</span>
            </div>
        );

    return (
        <div className="mt-4 space-y-4">
            <h4 className="text-xl font-semibold">
                Gestión de Enfrentamientos
            </h4>
            <Accordion type="single" collapsible className="w-full">
                {rondas.map(([nombreRonda, enfrentamientos], index) => {
                    const esUltima = esUltimaRonda(index);
                    const penultimate = rondas.length - 2;
                    const roundNumber = Number(nombreRonda.split(" ")[1]);
                    return (
                        <AccordionItem
                            key={nombreRonda}
                            value={`item-${index}`}
                        >
                            <AccordionTrigger className="px-4">
                                {nombreRonda}
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardHeader className="bg-muted/50 py-2">
                                        <div className="flex justify-between items-center px-4">
                                            <span className="font-semibold">
                                                ENFRENTAMIENTO
                                            </span>
                                            <span className="font-semibold">
                                                SELECCIÓN
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {enfrentamientos.map((match) => (
                                            <div
                                                key={match.id}
                                                className="flex justify-between items-center p-4 border-b last:border-b-0"
                                            >
                                                <span>
                                                    {match.jugador2 === null
                                                        ? match.jugador1?.nombre
                                                        : `${match.jugador1?.nombre} vs ${match.jugador2?.nombre}`}
                                                </span>

                                                {esUltima ? (
                                                    match.jugador2 === null ? (
                                                        <span className="text-yellow-500 font-semibold">
                                                            BYE
                                                        </span>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    estaSeleccionado(
                                                                        match.id,
                                                                        match
                                                                            .jugador1
                                                                            ?.id
                                                                    )
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                onClick={() =>
                                                                    handleSeleccion(
                                                                        match.id,
                                                                        match
                                                                            .jugador1
                                                                            ?.id
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    match
                                                                        .jugador1
                                                                        ?.nombre
                                                                }
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    esEmpateSeleccionado(
                                                                        match.id
                                                                    )
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                onClick={() =>
                                                                    handleSeleccion(
                                                                        match.id,
                                                                        null,
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                Empate
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    estaSeleccionado(
                                                                        match.id,
                                                                        match
                                                                            .jugador2
                                                                            ?.id
                                                                    )
                                                                        ? "default"
                                                                        : "outline"
                                                                }
                                                                onClick={() =>
                                                                    handleSeleccion(
                                                                        match.id,
                                                                        match
                                                                            .jugador2
                                                                            ?.id
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    match
                                                                        .jugador2
                                                                        ?.nombre
                                                                }
                                                            </Button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        {match.finalizado
                                                            ? match.jugador2 ===
                                                              null
                                                                ? "BYE"
                                                                : match.ganador
                                                                ? `Ganador: ${match.ganador.nombre}`
                                                                : "Empate"
                                                            : "Pendiente"}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                    {index === penultimate ? (
                                        <CardFooter>
                                            <Button
                                                onClick={() =>
                                                    onEditRound(roundNumber)
                                                }
                                            >
                                                Editar ronda
                                            </Button>
                                        </CardFooter>
                                    ) : (
                                        ""
                                    )}
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            <div className="flex gap-2 mt-4">
                <Button
                    onClick={generarSiguienteRondaConGuardado}
                    disabled={guardando || !puedeGenerarSiguienteRonda}
                >
                    {guardando ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {rondas.length >= rondasRecomendadas
                                ? "Finalizando Torneo..."
                                : "Generando Siguiente Ronda..."}
                        </>
                    ) : rondas.length >= rondasRecomendadas ? (
                        "Finalizar Torneo"
                    ) : (
                        "Siguiente Ronda"
                    )}
                </Button>

                <Button
                    variant="destructive"
                    onClick={finalizarElTorneoManual}
                    disabled={guardando}
                >
                    Finalizar Torneo (Manual)
                </Button>
            </div>
        </div>
    );
};

export default AdminEnfrentamientos;
