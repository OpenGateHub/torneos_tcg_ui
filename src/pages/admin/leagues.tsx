import { useState } from "react";
import {
    Plus,
    Calendar,
    Users,
    Trophy,
    Clock,
    CheckCircle,
    Eye,
    Edit,
    Trash2,
    Filter,
    Star,
    Target,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export function LeaguesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSeason, setFilterSeason] = useState("all");

    // Datos de ejemplo para ligas activas
    const activeLeagues = [
        {
            id: 1,
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
            description: "Liga oficial profesional con los mejores equipos",
            prize: "₡500,000",
            currentLeader: "Team Rocket Elite",
        },
        {
            id: 2,
            name: "Liga Amateur",
            season: "2025-1",
            startDate: "2025-02-01",
            endDate: "2025-07-15",
            teams: 8,
            maxTeams: 10,
            matches: 12,
            totalMatches: 45,
            status: "active",
            registrationOpen: true,
            organizer: "Javier Mora",
            description: "Liga para jugadores nuevos y amateur",
            prize: "₡100,000",
            currentLeader: "Novice Trainers",
        },
        {
            id: 3,
            name: "Liga Universitaria",
            season: "2025-1",
            startDate: "2025-03-01",
            endDate: "2025-08-30",
            teams: 6,
            maxTeams: 8,
            matches: 8,
            totalMatches: 28,
            status: "active",
            registrationOpen: true,
            organizer: "Admin",
            description: "Liga exclusiva para estudiantes universitarios",
            prize: "₡75,000",
            currentLeader: "UCR Dragons",
        },
    ];

    // Datos de ejemplo para ligas finalizadas
    const finishedLeagues = [
        {
            id: 4,
            name: "Liga Profesional Pokémon",
            season: "2024-2",
            startDate: "2024-08-15",
            endDate: "2024-12-30",
            teams: 12,
            maxTeams: 12,
            matches: 66,
            totalMatches: 66,
            status: "finished",
            champion: "Pallet Town Masters",
            organizer: "Admin",
            description: "Liga profesional temporada 2024-2",
            prize: "₡500,000",
            finalStandings: [
                "Pallet Town Masters",
                "Team Rocket Elite",
                "Cerulean Waves",
            ],
        },
        {
            id: 5,
            name: "Liga de Verano",
            season: "2024-Summer",
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            teams: 10,
            maxTeams: 10,
            matches: 45,
            totalMatches: 45,
            status: "finished",
            champion: "Summer Champions",
            organizer: "Javier Mora",
            description: "Liga especial de temporada de verano",
            prize: "₡200,000",
            finalStandings: [
                "Summer Champions",
                "Beach Trainers",
                "Vacation Squad",
            ],
        },
        {
            id: 6,
            name: "Liga Regional Norte",
            season: "2024-1",
            startDate: "2024-01-15",
            endDate: "2024-06-30",
            teams: 8,
            maxTeams: 8,
            matches: 28,
            totalMatches: 28,
            status: "finished",
            champion: "Northern Stars",
            organizer: "Admin",
            description: "Liga regional del norte del país",
            prize: "₡150,000",
            finalStandings: [
                "Northern Stars",
                "Mountain Climbers",
                "Forest Rangers",
            ],
        },
    ];

    const seasonBadgeColor = (season: string) => {
        if (season.includes("2025")) {
            return "bg-green-100 text-green-800 border-green-200";
        } else if (season.includes("Summer")) {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        } else {
            return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const filteredActiveLeagues = activeLeagues.filter((league) => {
        const matchesSearch = league.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesSeason =
            filterSeason === "all" || league.season === filterSeason;
        return matchesSearch && matchesSeason;
    });

    const filteredFinishedLeagues = finishedLeagues.filter((league) => {
        const matchesSearch = league.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesSeason =
            filterSeason === "all" || league.season === filterSeason;
        return matchesSearch && matchesSeason;
    });

    const LeagueCard = ({
        league,
        isActive = true,
    }: {
        league: any;
        isActive?: boolean;
    }) => {
        const progress = isActive
            ? (league.matches / league.totalMatches) * 100
            : 100;

        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <CardTitle className="text-xl">
                                {league.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={seasonBadgeColor(league.season)}
                                >
                                    Temporada {league.season}
                                </Badge>
                                {isActive && (
                                    <Badge
                                        variant={
                                            league.registrationOpen
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {league.registrationOpen
                                            ? "Inscripciones Abiertas"
                                            : "Liga en Curso"}
                                    </Badge>
                                )}
                                {!isActive && league.champion && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                        <Trophy className="w-3 h-3 mr-1" />
                                        Campeón: {league.champion}
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
                    <CardDescription>{league.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Período</p>
                                <p className="text-sm text-muted-foreground">
                                    {league.startDate} - {league.endDate}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Equipos</p>
                                <p className="text-sm text-muted-foreground">
                                    {league.teams}/{league.maxTeams}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Partidos</p>
                                <p className="text-sm text-muted-foreground">
                                    {league.matches}/{league.totalMatches}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Premio</p>
                                <p className="text-sm text-muted-foreground">
                                    {league.prize}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isActive && (
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    Progreso de la Liga
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">
                                    <span className="font-medium">
                                        Líder actual:
                                    </span>{" "}
                                    {league.currentLeader}
                                </span>
                            </div>
                        </div>
                    )}

                    {!isActive && league.finalStandings && (
                        <div className="space-y-3 mb-4">
                            <h4 className="text-sm font-medium">
                                Clasificación Final
                            </h4>
                            <div className="space-y-2">
                                {league.finalStandings
                                    .slice(0, 3)
                                    .map((team, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    index === 0
                                                        ? "bg-yellow-500 text-white"
                                                        : index === 1
                                                        ? "bg-gray-400 text-white"
                                                        : "bg-orange-600 text-white"
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span className="text-sm">
                                                {team}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                        <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-xs">
                                {league.organizer
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                            Organizado por {league.organizer}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        {isActive ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Finaliza: {league.endDate}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        Ver Tabla
                                    </Button>
                                    <Button
                                        size="sm"
                                    >
                                        Ver Detalles
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">
                                        Liga Finalizada
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        Ver Estadísticas
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        Tabla Final
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Ligas</h1>
                        <p className="text-muted-foreground">
                            Administra todas las ligas y temporadas de la
                            plataforma
                        </p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Liga
                    </Button>
                </div>

                {/* Filtros y Búsqueda */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar ligas..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filterSeason}
                                    onValueChange={setFilterSeason}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Temporada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Todas las temporadas
                                        </SelectItem>
                                        <SelectItem value="2025-1">
                                            2025-1
                                        </SelectItem>
                                        <SelectItem value="2024-2">
                                            2024-2
                                        </SelectItem>
                                        <SelectItem value="2024-Summer">
                                            2024-Summer
                                        </SelectItem>
                                        <SelectItem value="2024-1">
                                            2024-1
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {activeLeagues.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Ligas Activas
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {finishedLeagues.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Ligas Finalizadas
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {activeLeagues.reduce(
                                            (sum, l) => sum + l.teams,
                                            0
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Equipos Activos
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                                    <Trophy className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        ₡675K
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Premios Activos
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs de Ligas */}
                <Tabs defaultValue="active" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="active"
                            className="flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Ligas Activas ({filteredActiveLeagues.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="finished"
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Ligas Finalizadas ({filteredFinishedLeagues.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        {filteredActiveLeagues.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredActiveLeagues.map((league) => (
                                    <LeagueCard
                                        key={league.id}
                                        league={league}
                                        isActive={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No hay ligas activas
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchTerm || filterSeason !== "all"
                                            ? "No se encontraron ligas con los filtros aplicados"
                                            : "Crea una nueva liga para comenzar la temporada"}
                                    </p>
                                    <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Primera Liga
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="finished" className="space-y-4">
                        {filteredFinishedLeagues.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredFinishedLeagues.map((league) => (
                                    <LeagueCard
                                        key={league.id}
                                        league={league}
                                        isActive={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No hay ligas finalizadas
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm || filterSeason !== "all"
                                            ? "No se encontraron ligas con los filtros aplicados"
                                            : "Las ligas completadas aparecerán aquí"}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
