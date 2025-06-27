import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    Trophy,
    Calendar,
    Users,
    Target,
    Plus,
    Eye,
    Edit,
    Trash2,
    Clock,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function LeagueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [isAddTournamentOpen, setIsAddTournamentOpen] = useState(false);
    const [tournamentForm, setTournamentForm] = useState({
        name: "",
        format: "",
        startDate: "",
        endDate: "",
        maxParticipants: "",
        prize: "",
        description: "",
    });

    // Datos de ejemplo de la liga
    const leagueData = {
        id: id,
        name: "Liga Profesional Pokémon",
        season: "2025-1",
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        teams: 12,
        maxTeams: 12,
        matches: 45,
        totalMatches: 66,
        status: "active",
        registrationOpen: false,
        organizer: "Admin",
        description:
            "Liga oficial profesional con los mejores equipos del país. Temporada 2025-1 con formato round-robin.",
        prize: "₡500,000",
        currentLeader: "Team Rocket Elite",
        rules: [
            "Formato Swiss de 7 rondas",
            "Tiempo límite: 50 minutos por partida",
            "Deck list obligatorio antes del inicio",
            "Prohibido el uso de cartas baneadas",
        ],
    };

    // Torneos asociados a la liga
    const leagueTournaments = [
        {
            id: 1,
            name: "Torneo Apertura Liga Pro",
            format: "Standard",
            startDate: "2025-01-20",
            endDate: "2025-01-22",
            participants: 12,
            maxParticipants: 12,
            prize: "₡50,000",
            status: "finished",
            winner: "Team Rocket Elite",
        },
        {
            id: 2,
            name: "Torneo Mid-Season",
            format: "Standard",
            startDate: "2025-03-15",
            endDate: "2025-03-17",
            participants: 10,
            maxParticipants: 12,
            prize: "₡75,000",
            status: "active",
        },
        {
            id: 3,
            name: "Torneo de Clausura",
            format: "Standard",
            startDate: "2025-06-20",
            endDate: "2025-06-22",
            participants: 0,
            maxParticipants: 12,
            prize: "₡100,000",
            status: "upcoming",
        },
    ];

    const progress = (leagueData.matches / leagueData.totalMatches) * 100;

    const handleAddTournament = () => {
        console.log("Agregando torneo:", tournamentForm);
        setIsAddTournamentOpen(false);
        // Aquí iría la lógica para agregar el torneo
    };

    const TournamentCard = ({ tournament }: { tournament: any }) => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <CardTitle className="text-lg">
                            {tournament.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{tournament.format}</Badge>
                            <Badge
                                variant={
                                    tournament.status === "active"
                                        ? "default"
                                        : tournament.status === "finished"
                                        ? "secondary"
                                        : "outline"
                                }
                            >
                                {tournament.status === "active"
                                    ? "En Curso"
                                    : tournament.status === "finished"
                                    ? "Finalizado"
                                    : "Próximo"}
                            </Badge>
                            {tournament.winner && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    {tournament.winner}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Fechas</p>
                            <p className="text-sm text-muted-foreground">
                                {tournament.startDate} - {tournament.endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Participantes</p>
                            <p className="text-sm text-muted-foreground">
                                {tournament.participants}/
                                {tournament.maxParticipants}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Premio</p>
                            <p className="text-sm text-muted-foreground">
                                {tournament.prize}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {tournament.status === "active" ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                        ) : tournament.status === "finished" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                            <Target className="w-4 h-4 text-orange-600" />
                        )}
                        <div>
                            <p className="text-sm font-medium">Estado</p>
                            <p className="text-sm text-muted-foreground">
                                {tournament.status === "active"
                                    ? "En progreso"
                                    : tournament.status === "finished"
                                    ? "Completado"
                                    : "Programado"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {leagueData.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Temporada {leagueData.season}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    `/admin/ligas/${id}/tabla`,
                                    "_blank"
                                )
                            }
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Ver Tabla
                        </Button>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            Liga Activa
                        </Badge>
                    </div>
                </div>

                {/* Información General */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información de la Liga</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                {leagueData.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Período
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {leagueData.startDate} -{" "}
                                            {leagueData.endDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Equipos
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {leagueData.teams}/
                                            {leagueData.maxTeams}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Partidos
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {leagueData.matches}/
                                            {leagueData.totalMatches}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Premio
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {leagueData.prize}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Progreso de la Liga
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reglas de la Liga</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {leagueData.rules.map((rule, index) => (
                                    <li
                                        key={index}
                                        className="text-sm flex items-start gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Torneos de la Liga */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Torneos de la Liga</CardTitle>
                                <CardDescription>
                                    Torneos asociados a esta liga
                                </CardDescription>
                            </div>
                            <Dialog
                                open={isAddTournamentOpen}
                                onOpenChange={setIsAddTournamentOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Torneo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Agregar Torneo a la Liga
                                        </DialogTitle>
                                        <DialogDescription>
                                            Crea un nuevo torneo asociado a{" "}
                                            {leagueData.name}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Nombre del Torneo
                                            </Label>
                                            <Input
                                                id="name"
                                                value={tournamentForm.name}
                                                onChange={(e) =>
                                                    setTournamentForm({
                                                        ...tournamentForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Ej: Torneo Especial Liga Pro"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="format">
                                                Formato
                                            </Label>
                                            <Select
                                                value={tournamentForm.format}
                                                onValueChange={(value) =>
                                                    setTournamentForm({
                                                        ...tournamentForm,
                                                        format: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona formato" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Standard">
                                                        Standard
                                                    </SelectItem>
                                                    <SelectItem value="Expanded">
                                                        Expanded
                                                    </SelectItem>
                                                    <SelectItem value="Blitz">
                                                        Blitz
                                                    </SelectItem>
                                                    <SelectItem value="Theme Deck">
                                                        Theme Deck
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="startDate">
                                                    Fecha Inicio
                                                </Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={
                                                        tournamentForm.startDate
                                                    }
                                                    onChange={(e) =>
                                                        setTournamentForm({
                                                            ...tournamentForm,
                                                            startDate:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="endDate">
                                                    Fecha Fin
                                                </Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={
                                                        tournamentForm.endDate
                                                    }
                                                    onChange={(e) =>
                                                        setTournamentForm({
                                                            ...tournamentForm,
                                                            endDate:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="maxParticipants">
                                                    Max Participantes
                                                </Label>
                                                <Input
                                                    id="maxParticipants"
                                                    type="number"
                                                    value={
                                                        tournamentForm.maxParticipants
                                                    }
                                                    onChange={(e) =>
                                                        setTournamentForm({
                                                            ...tournamentForm,
                                                            maxParticipants:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="12"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="prize">
                                                    Premio
                                                </Label>
                                                <Input
                                                    id="prize"
                                                    value={tournamentForm.prize}
                                                    onChange={(e) =>
                                                        setTournamentForm({
                                                            ...tournamentForm,
                                                            prize: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="₡50,000"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">
                                                Descripción
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={
                                                    tournamentForm.description
                                                }
                                                onChange={(e) =>
                                                    setTournamentForm({
                                                        ...tournamentForm,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Descripción del torneo..."
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsAddTournamentOpen(false)
                                            }
                                        >
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleAddTournament}>
                                            Crear Torneo
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {leagueTournaments.map((tournament) => (
                                <TournamentCard
                                    key={tournament.id}
                                    tournament={tournament}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
