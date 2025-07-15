import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/api/queryKeys";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";

type RankingGeneralType = {
    byes: number;
    derrotas: number;
    empates: number;
    jugadorId: number;
    nombre: string;
    porcentajeVictorias: string;
    puntaje: number;
    total: number;
    victorias: number;
};

type RankingResponse = {
    results: RankingGeneralType[];
};

export function RankingGeneral() {
    const navigate = useNavigate();

    const leagueRanking = useQuery({
        queryFn: async () => {
            const { data } = await axiosClient.get<RankingResponse>(
                apiUrls.general.public_ranking
            );
            console.log(data);
            return data;
        },
        queryKey: [QueryKeys.PUBLIC_RANKING],
    });

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

    const handleGoToLeague = () => {
        navigate(-1);
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
                            onClick={handleGoToLeague}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">
                            </h1>
                            <p className="text-muted-foreground">
                                Tabla de Posiciones
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        NACIONAL
                    </Badge>
                </div>
                {/* Tabla de Posiciones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tabla de Posiciones</CardTitle>
                        <CardDescription>
                            Clasificación actual general
                        </CardDescription>
                    </CardHeader>
                    {leagueRanking.isLoading ? (
                        "..."
                    ) : (
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                Pos
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Jugador
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Victorias
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Derrotas
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Empates
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Byes
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Promedio de victorias
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Puntos
                                            </TableHead>
                                            {/* <TableHead className="text-center">
                                            Forma
                                        </TableHead> */}
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leagueRanking.data.results.map(
                                            (item, index) => (
                                                <TableRow
                                                    key={item.jugadorId}
                                                    className="hover:bg-muted/50"
                                                >
                                                    <TableCell>
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(
                                                                index + 1
                                                            )}`}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium">
                                                                {item.nombre}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-green-600 font-medium">
                                                        {item.victorias}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.empates}
                                                    </TableCell>
                                                    <TableCell className="text-center text-red-600 font-medium">
                                                        {item.derrotas}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.byes}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {
                                                            item.porcentajeVictorias
                                                        }
                                                    </TableCell>

                                                    <TableCell className="text-center font-bold">
                                                        {item.puntaje}
                                                    </TableCell>
                                                    {/* <TableCell>
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
                                            </TableCell> */}
                                                    {/* <TableCell className="text-center">
                                                {getTrendIcon(team.trend)}
                                            </TableCell> */}
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
