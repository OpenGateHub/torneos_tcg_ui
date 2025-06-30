import { apiUrls } from "@/api/apiUrls";
import { QueryKeys } from "@/api/queryKeys";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axiosClient from "@/services/axios";
import { LeagueType } from "@/types/league.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCircle, Clock, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const LeagueCard = ({
    league,
    isActive = true,
}: {
    league: LeagueType;
    isActive?: boolean;
}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            await axiosClient.delete(apiUrls.leagues.mutation(league.id));
        },
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.LEAGUE_LIST],
            });
        },
    });

    const deleteLeague = () => {
        if (confirm("Desea elimintar esta liga?")) {
            mutation.mutate();
        }
    };
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <CardTitle className="text-xl">{league.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                        </Button> */}
                        {/* <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                        </Button> */}
                        <Button
                            onClick={deleteLeague}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <CardDescription>{league?.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Período</p>
                            <div className="text-sm text-muted-foreground">
                                {new Date(league.startDate).toLocaleDateString(
                                    "es-AR",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }
                                )}{" "}
                                -{" "}
                                {new Date(league.endDate).toLocaleDateString(
                                    "es-AR",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                            {league?.company?.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                        Organizado por {league?.company?.name}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    {isActive ? (
                        <>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Finaliza:{" "}
                                    {new Date(
                                        league.endDate
                                    ).toLocaleDateString("es-AR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {/* <Button size="sm" variant="outline">
                                    Ver Tabla
                                </Button> */}
                                <Button asChild size="sm">
                                    <Link to={`/admin/ligas/detalles/${league.id}`}>
                                        Ver Detalles
                                    </Link>
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
