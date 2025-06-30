import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddLeagueModal } from "@/components/admin/leagues/add-league-modal";
import { LeagueCard } from "@/components/admin/leagues/league-item-card";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/axios";
import { apiUrls } from "@/api/apiUrls";
import { PaginatedResponse } from "@/types/torneo";
import { LeagueType } from "@/types/league.types";
import { QueryKeys } from "@/api/queryKeys";

export function LeaguesPage() {
    const [addLeagueModalOpen, setAddLeagueModalOpen] = useState(false);

    const query = useQuery({
        queryFn: async () => {
            const { data } = await axiosClient.get<
                PaginatedResponse<LeagueType>
            >(apiUrls.leagues.base);
            return data;
        },
        refetchOnWindowFocus: false,
        queryKey: [QueryKeys.LEAGUE_LIST],
    });
    const handleAddLeague = () => {
        setAddLeagueModalOpen(true);
    };

    return (
        <>
            <AddLeagueModal
                open={addLeagueModalOpen}
                onClose={() => setAddLeagueModalOpen(false)}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="max-w-7xl mx-auto w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Gestión de Ligas
                            </h1>
                            <p className="text-muted-foreground">
                                Administra todas las ligas y temporadas de la
                                plataforma
                            </p>
                        </div>
                        <Button onClick={handleAddLeague}>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Liga
                        </Button>
                    </div>

                    {/* Filtros y Búsqueda */}
                    {/* <Card>
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
                </Card> */}

                    {/* Estadísticas Rápidas */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </div> */}

                    {/* Tabs de Ligas */}
                    <Tabs defaultValue="active" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="active"
                                className="flex items-center gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Ligas ({query?.data?.pagination.count})
                            </TabsTrigger>
                            {/* <TabsTrigger
                            value="finished"
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Ligas Finalizadas ({filteredFinishedLeagues.length})
                        </TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="active" className="space-y-4">
                            {query?.data?.pagination?.count > 0 ? (
                                <div className="grid gap-4">
                                    {query?.data?.data.map((league) => (
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
                                            Crea una nueva liga para comenzar la
                                            temporada
                                        </p>
                                        <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Crear Primera Liga
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* <TabsContent value="finished" className="space-y-4">
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
                    </TabsContent> */}
                    </Tabs>
                </div>
            </div>
        </>
    );
}
