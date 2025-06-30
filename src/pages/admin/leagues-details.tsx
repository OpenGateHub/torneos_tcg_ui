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
import { simpleFormatDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";
import { TorneosPage } from "./torneos";
import { LeagueType } from "@/types/league.types";

export function LeagueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [isAddTournamentOpen, setIsAddTournamentOpen] = useState(false);

    const queryLeague = useQuery({
        queryFn: async () => {
            const { data } = await axiosClient.get<LeagueType>(
                apiUrls.leagues.details(Number(id))
            );
            return data;
        },
    });

    const handleAddTournament = () => {
        setIsAddTournamentOpen(false);
        // Aquí iría la lógica para agregar el torneo
    };

    if (queryLeague.isLoading) {
        return <>...Cargando</>;
    }

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
                                {queryLeague?.data?.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Temporada {queryLeague?.data?.description}
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
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Información de la Liga</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            {queryLeague.data.name}
                        </p>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Período</p>
                                <p className="text-sm text-muted-foreground">
                                    {simpleFormatDate(
                                        queryLeague.data.startDate
                                    )}{" "}
                                    -{" "}
                                    {simpleFormatDate(queryLeague.data.endDate)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <TorneosPage leagueId={Number(id)} />
            </div>
        </div>
    );
}
