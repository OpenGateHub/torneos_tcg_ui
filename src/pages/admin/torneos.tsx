"use client"

import { useState } from "react"
import { Plus, Calendar, Users, Trophy, Clock, CheckCircle, Eye, Edit, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

export function TorneosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFormat, setFilterFormat] = useState("all")

  // Datos de ejemplo para torneos activos
  const activeTournaments = [
    {
      id: 1,
      name: "Torneo Semanal #48",
      format: "Standard",
      startDate: "2025-06-22",
      endDate: "2025-06-29",
      participants: 156,
      maxParticipants: 200,
      prize: "₡50,000",
      status: "active",
      registrationOpen: true,
      organizer: "Admin",
      description: "Torneo semanal oficial con formato Standard",
    },
    {
      id: 2,
      name: "Copa Relámpago",
      format: "Blitz",
      startDate: "2025-06-21",
      endDate: "2025-06-21",
      participants: 89,
      maxParticipants: 100,
      prize: "₡25,000",
      status: "active",
      registrationOpen: true,
      organizer: "Javier Mora",
      description: "Torneo rápido de un día",
    },
    {
      id: 3,
      name: "Liga de Maestros",
      format: "Expanded",
      startDate: "2025-06-20",
      endDate: "2025-07-05",
      participants: 45,
      maxParticipants: 50,
      prize: "₡100,000",
      status: "active",
      registrationOpen: false,
      organizer: "Admin",
      description: "Liga exclusiva para jugadores avanzados",
    },
  ]

  // Datos de ejemplo para torneos finalizados
  const finishedTournaments = [
    {
      id: 4,
      name: "Torneo Semanal #47",
      format: "Standard",
      startDate: "2025-06-15",
      endDate: "2025-06-20",
      participants: 200,
      maxParticipants: 200,
      prize: "₡50,000",
      status: "finished",
      winner: "PokeMaster_99",
      organizer: "Admin",
      description: "Torneo semanal oficial completado",
    },
    {
      id: 5,
      name: "Torneo de Novatos",
      format: "Theme Deck",
      startDate: "2025-06-10",
      endDate: "2025-06-14",
      participants: 78,
      maxParticipants: 100,
      prize: "₡15,000",
      status: "finished",
      winner: "NewTrainer_23",
      organizer: "Javier Mora",
      description: "Torneo especial para jugadores nuevos",
    },
    {
      id: 6,
      name: "Copa de Primavera",
      format: "Standard",
      startDate: "2025-05-20",
      endDate: "2025-06-05",
      participants: 324,
      maxParticipants: 350,
      prize: "₡200,000",
      status: "finished",
      winner: "ChampionAce",
      organizer: "Admin",
      description: "Gran torneo mensual de primavera",
    },
  ]

  const formatBadgeColor = (format: string) => {
    switch (format) {
      case "Standard":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Expanded":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Blitz":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Theme Deck":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredActiveTournaments = activeTournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFormat = filterFormat === "all" || tournament.format === filterFormat
    return matchesSearch && matchesFormat
  })

  const filteredFinishedTournaments = finishedTournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFormat = filterFormat === "all" || tournament.format === filterFormat
    return matchesSearch && matchesFormat
  })

  const TournamentCard = ({ tournament, isActive = true }: { tournament: any; isActive?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl">{tournament.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={formatBadgeColor(tournament.format)}>{tournament.format}</Badge>
              {isActive && (
                <Badge variant={tournament.registrationOpen ? "default" : "secondary"}>
                  {tournament.registrationOpen ? "Inscripciones Abiertas" : "Inscripciones Cerradas"}
                </Badge>
              )}
              {!isActive && tournament.winner && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Trophy className="w-3 h-3 mr-1" />
                  Ganador: {tournament.winner}
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
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{isActive ? "Inicio" : "Período"}</p>
              <p className="text-sm text-muted-foreground">
                {isActive ? tournament.startDate : `${tournament.startDate} - ${tournament.endDate}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Participantes</p>
              <p className="text-sm text-muted-foreground">
                {tournament.participants}/{tournament.maxParticipants}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Premio</p>
              <p className="text-sm text-muted-foreground">{tournament.prize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {isActive && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Finaliza: {tournament.endDate}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Ver Detalles
              </Button>
              {tournament.registrationOpen && (
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-yellow-500">
                  Inscribirse
                </Button>
              )}
            </div>
          </div>
        )}

        {!isActive && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Torneo Finalizado</span>
            </div>
            <Button size="sm" variant="outline">
              Ver Resultados
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Torneos</h1>
            <p className="text-muted-foreground">Administra todos los torneos de la plataforma</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
            <Link to={'/admin/torneos/crear'}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Torneo
            </Link>
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar torneos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterFormat} onValueChange={setFilterFormat}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los formatos</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Expanded">Expanded</SelectItem>
                    <SelectItem value="Blitz">Blitz</SelectItem>
                    <SelectItem value="Theme Deck">Theme Deck</SelectItem>
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
                  <div className="text-2xl font-bold">{activeTournaments.length}</div>
                  <div className="text-sm text-muted-foreground">Torneos Activos</div>
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
                  <div className="text-2xl font-bold">{finishedTournaments.length}</div>
                  <div className="text-sm text-muted-foreground">Finalizados</div>
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
                    {activeTournaments.reduce((sum, t) => sum + t.participants, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Participantes Activos</div>
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
                  <div className="text-2xl font-bold">₡375K</div>
                  <div className="text-sm text-muted-foreground">Premios Activos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Torneos */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Torneos Activos ({filteredActiveTournaments.length})
            </TabsTrigger>
            <TabsTrigger value="finished" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Torneos Finalizados ({filteredFinishedTournaments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredActiveTournaments.length > 0 ? (
              <div className="grid gap-4">
                {filteredActiveTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} isActive={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay torneos activos</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterFormat !== "all"
                      ? "No se encontraron torneos con los filtros aplicados"
                      : "Crea un nuevo torneo para comenzar"}
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Torneo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="finished" className="space-y-4">
            {filteredFinishedTournaments.length > 0 ? (
              <div className="grid gap-4">
                {filteredFinishedTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} isActive={false} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay torneos finalizados</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterFormat !== "all"
                      ? "No se encontraron torneos con los filtros aplicados"
                      : "Los torneos completados aparecerán aquí"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
