import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    Trophy,
    TrendingUp,
    TrendingDown,
    Minus,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function LeagueTablePage() {
    // Datos de ejemplo de la liga

    const { id } = useParams<{ id: string }>();
    const leagueData = {
        id: id,
        name: "Liga Profesional Pokémon",
        season: "2025-1",
        status: "active",
    };

    // Datos de ejemplo de la tabla de posiciones
    const standings = [
        {
            position: 1,
            team: "Team Rocket Elite",
            logo: "TRE",
            played: 18,
            won: 15,
            lost: 3,
            points: 45,
            goalsFor: 89,
            goalsAgainst: 34,
            goalDifference: 55,
            form: ["W", "W", "W", "L", "W"],
            trend: "up",
        },
        {
            position: 2,
            team: "Pallet Town Masters",
            logo: "PTM",
            played: 18,
            won: 14,
            lost: 4,
            points: 42,
            goalsFor: 78,
            goalsAgainst: 28,
            goalDifference: 50,
            form: ["W", "W", "L", "W", "W"],
            trend: "up",
        },
        {
            position: 3,
            team: "Cerulean Waves",
            logo: "CW",
            played: 18,
            won: 12,
            lost: 6,
            points: 36,
            goalsFor: 67,
            goalsAgainst: 45,
            goalDifference: 22,
            form: ["L", "W", "W", "W", "L"],
            trend: "down",
        },
        {
            position: 4,
            team: "Viridian Forest",
            logo: "VF",
            played: 18,
            won: 11,
            lost: 7,
            points: 33,
            goalsFor: 58,
            goalsAgainst: 52,
            goalDifference: 6,
            form: ["W", "L", "W", "L", "W"],
            trend: "same",
        },
        {
            position: 5,
            team: "Pewter Rocks",
            logo: "PR",
            played: 18,
            won: 10,
            lost: 8,
            points: 30,
            goalsFor: 55,
            goalsAgainst: 48,
            goalDifference: 7,
            form: ["L", "L", "W", "W", "L"],
            trend: "down",
        },
        {
            position: 6,
            team: "Lavender Spirits",
            logo: "LS",
            played: 18,
            won: 9,
            lost: 9,
            points: 27,
            goalsFor: 49,
            goalsAgainst: 51,
            goalDifference: -2,
            form: ["W", "L", "L", "W", "L"],
            trend: "same",
        },
        {
            position: 7,
            team: "Saffron Psychics",
            logo: "SP",
            played: 18,
            won: 8,
            lost: 10,
            points: 24,
            goalsFor: 42,
            goalsAgainst: 58,
            goalDifference: -16,
            form: ["L", "W", "L", "L", "W"],
            trend: "up",
        },
        {
            position: 8,
            team: "Fuchsia Ninjas",
            logo: "FN",
            played: 18,
            won: 7,
            lost: 11,
            points: 21,
            goalsFor: 38,
            goalsAgainst: 62,
            goalDifference: -24,
            form: ["L", "L", "L", "W", "L"],
            trend: "down",
        },
        {
            position: 9,
            team: "Cinnabar Flames",
            logo: "CF",
            played: 18,
            won: 5,
            lost: 13,
            points: 15,
            goalsFor: 31,
            goalsAgainst: 71,
            goalDifference: -40,
            form: ["L", "L", "W", "L", "L"],
            trend: "down",
        },
        {
            position: 10,
            team: "Indigo Plateau",
            logo: "IP",
            played: 18,
            won: 3,
            lost: 15,
            points: 9,
            goalsFor: 22,
            goalsAgainst: 79,
            goalDifference: -57,
            form: ["L", "L", "L", "L", "W"],
            trend: "down",
        },
    ];

    const getPositionColor = (position: number) => {
        if (position <= 3) return "text-green-600 bg-green-50";
        if (position <= 6) return "text-blue-600 bg-blue-50";
        if (position <= 8) return "text-orange-600 bg-orange-50";
        return "text-red-600 bg-red-50";
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case "down":
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-400" />;
        }
    };

    const getFormBadge = (result: string) => {
        return (
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    result === "W"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                }`}
            >
                {result}
            </div>
        );
    };

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
                                Tabla de Posiciones - Temporada{" "}
                                {leagueData.season}
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Liga Activa
                    </Badge>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                                    <Trophy className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {standings[0].team}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Líder
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {standings.reduce(
                                    (sum, team) => sum + team.played,
                                    0
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Partidos Jugados
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {standings.reduce(
                                    (sum, team) => sum + team.goalsFor,
                                    0
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Goles Total
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {Math.round(
                                    standings.reduce(
                                        (sum, team) => sum + team.goalsFor,
                                        0
                                    ) / standings.length
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Promedio por Equipo
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de Posiciones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tabla de Posiciones</CardTitle>
                        <CardDescription>
                            Clasificación actual de la liga
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            Pos
                                        </TableHead>
                                        <TableHead>Equipo</TableHead>
                                        <TableHead className="text-center">
                                            PJ
                                        </TableHead>
                                        <TableHead className="text-center">
                                            PG
                                        </TableHead>
                                        <TableHead className="text-center">
                                            PP
                                        </TableHead>
                                        <TableHead className="text-center">
                                            GF
                                        </TableHead>
                                        <TableHead className="text-center">
                                            GC
                                        </TableHead>
                                        <TableHead className="text-center">
                                            DG
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Pts
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Forma
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {standings.map((team) => (
                                        <TableRow
                                            key={team.position}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell>
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(
                                                        team.position
                                                    )}`}
                                                >
                                                    {team.position}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="text-xs font-bold">
                                                            {team.logo}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">
                                                        {team.team}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {team.played}
                                            </TableCell>
                                            <TableCell className="text-center text-green-600 font-medium">
                                                {team.won}
                                            </TableCell>
                                            <TableCell className="text-center text-red-600 font-medium">
                                                {team.lost}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {team.goalsFor}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {team.goalsAgainst}
                                            </TableCell>
                                            <TableCell
                                                className={`text-center font-medium ${
                                                    team.goalDifference >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {team.goalDifference > 0
                                                    ? "+"
                                                    : ""}
                                                {team.goalDifference}
                                            </TableCell>
                                            <TableCell className="text-center font-bold">
                                                {team.points}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 justify-center">
                                                    {team.form.map(
                                                        (result, index) => (
                                                            <div key={index}>
                                                                {getFormBadge(
                                                                    result
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getTrendIcon(team.trend)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Leyenda */}
                        <div className="mt-6 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-50 border border-green-200"></div>
                                <span>
                                    Posiciones 1-3: Clasificación directa
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200"></div>
                                <span>Posiciones 4-6: Playoff</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-orange-50 border border-orange-200"></div>
                                <span>Posiciones 7-8: Zona media</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-red-50 border border-red-200"></div>
                                <span>Posiciones 9-10: Zona de descenso</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
