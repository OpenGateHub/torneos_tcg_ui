import { Torneo } from "@/types/torneo";
("use client");

import {
    Calendar,
    Users,
    Clock,
    CheckCircle,
    Eye,
    Edit,
    Trash2,
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
import { Link } from "react-router-dom";

const formatBadgeColor = (format: string) => {
    switch (format) {
        case "Standard":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Expanded":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "Blitz":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "Theme Deck":
            return "bg-green-100 text-green-800 border-green-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

export const TournamentCard = ({
    tournament,
    isActive = true,
}: {
    tournament: Torneo;
    isActive?: boolean;
}) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <CardTitle className="text-xl">
                        {tournament.nombre}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge className={formatBadgeColor(tournament.tipo)}>
                            {tournament.tipo}
                        </Badge>
                        {isActive && (
                            <Badge
                                variant={
                                    tournament.inscripcionesCerradas
                                        ? "secondary"
                                        : "default"
                                }
                            >
                                {tournament.inscripcionesCerradas
                                    ? "Inscripciones Cerradas"
                                    : "Inscripciones Abiertas"}
                            </Badge>
                        )}
                        {/* {!isActive && tournament.winner && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                <Trophy className="w-3 h-3 mr-1" />
                                Ganador: {tournament.winner}
                            </Badge>
                        )} */}
                    </div>
                </div>
                {/* <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div> */}
            </div>
            <CardDescription>{tournament.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">
                            {isActive ? "Inicio" : "Período"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isActive
                                ? new Date(
                                      tournament.fecha_inicio
                                  ).toLocaleDateString("es-AR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  })
                                : `${new Date(
                                      tournament.fecha_inicio
                                  ).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  })} - ${new Date(
                                      tournament.fecha_fin
                                  ).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  })}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Participantes</p>
                        <p className="text-sm text-muted-foreground">
                            {tournament.participantes}/
                            {tournament.maxParticipantes}
                        </p>
                    </div>
                </div>
                {/* <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Premio</p>
                        <p className="text-sm text-muted-foreground">
                            {tournament.prize}
                        </p>
                    </div>
                </div> */}
                {/* <div className="flex items-center gap-2">
        <Avatar className="w-4 h-4">
          <AvatarFallback className="text-xs">
            {tournament.organizer
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Organizador</p>
          <p className="text-sm text-muted-foreground">{tournament.organizer}</p>
        </div>
      </div> */}
            </div>

            {isActive && (
                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Finaliza:{" "}
                            {new Date(tournament.fecha_fin).toLocaleDateString(
                                "es-AR",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/torneos/${tournament.id}`}>
                                Ver Detalles
                            </Link>
                        </Button>
                        {/* {!tournament.inscripcionesCerradas && (
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-yellow-500"
                            >
                                Inscribirse
                            </Button>
                        )} */}
                    </div>
                </div>
            )}

            {!isActive && (
                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                            Torneo Finalizado
                        </span>
                    </div>
                    <Button size="sm" variant="outline">
                        Ver Resultados
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
);
