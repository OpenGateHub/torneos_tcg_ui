import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Link } from "react-router-dom";
import { useTorneosList } from "@/hooks/use-torneos-list";
import { TournamentCard } from "@/components/admin/torneos/card-torneo";

export function TorneosPage({ leagueId }: { leagueId?: number }) {
    const torneos = useTorneosList();

    if (torneos.isLoading) {
        return <div>loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Gestión de Torneos
                        </h1>
                        <p className="text-muted-foreground">
                            Administra los torneos de esta liga
                        </p>
                    </div>
                    <Button asChild>
                        <Link to={`/admin/torneos/crear?league=${leagueId}`}>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Torneo
                        </Link>
                    </Button>
                </div>

                {/* Filtros y Búsqueda */}
                {/* <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar torneos..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Estadísticas Rápidas */}
                {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {torneos?.data?.pagination.totalItems}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Torneos Activos
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
                                        0
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Finalizados
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
                                    <div className="text-2xl font-bold">1</div>
                                    <div className="text-sm text-muted-foreground">
                                        Participantes Activos
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Tabs de Torneos */}
                <Tabs defaultValue="active" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="active"
                            className="flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Torneos Activos ({torneos?.data?.pagination.count})
                        </TabsTrigger>
                        {/* <TabsTrigger
                            value="finished"
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Torneos Finalizados (0)
                        </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        {torneos?.data?.pagination?.count > 0 ? (
                            <div className="grid gap-4">
                                {torneos?.data?.data?.map((tournament) => (
                                    <TournamentCard
                                        key={tournament.id}
                                        tournament={tournament}
                                        isActive={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No hay torneos activos
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        "Crea un nuevo torneo para comenzar"
                                    </p>
                                    <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Primer Torneo
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* <TabsContent value="finished" className="space-y-4">
                        {filteredFinishedTournaments.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredFinishedTournaments.map(
                                    (tournament) => (
                                        <TournamentCard
                                            key={tournament.id}
                                            tournament={tournament}
                                            isActive={false}
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No hay torneos finalizados
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm || filterFormat !== "all"
                                            ? "No se encontraron torneos con los filtros aplicados"
                                            : "Los torneos completados aparecerán aquí"}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent> */}
                </Tabs>
            </div>
        </div>
    );
}
