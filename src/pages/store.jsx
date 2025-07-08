import { useState } from "react";
import {
    Store,
    MapPin,
    Phone,
    Coins,
    Edit,
    Trophy,
    Users,
    Calendar,
    TrendingUp,
    Plus,
    Eye,
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
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StorePage() {
    const [isEditingStore, setIsEditingStore] = useState(false);
    const [storeData, setStoreData] = useState({
        name: "GameZone Central",
        address: "Av. Central, San José, Costa Rica",
        contact: "+506 2222-3333",
        coinName: "GameCoins",
        description:
            "Tienda especializada en juegos de cartas y torneos competitivos de Pokémon",
        established: "2023-01-15",
        status: "active",
    });

    // Estadísticas de mi tienda
    const storeStats = {
        totalTournaments: 45,
        activeTournaments: 3,
        totalPlayers: 234,
        monthlyRevenue: "₡450,000",
        rating: 4.8,
        totalReviews: 67,
    };

    // Mis torneos recientes
    const myTournaments = [
        {
            id: 1,
            name: "Torneo Semanal #48",
            date: "2025-06-22",
            participants: 24,
            status: "active",
            prize: "₡50,000",
        },
        {
            id: 2,
            name: "Copa Relámpago",
            date: "2025-06-21",
            participants: 16,
            status: "finished",
            prize: "₡25,000",
        },
        {
            id: 3,
            name: "Liga de Maestros",
            date: "2025-06-20",
            participants: 12,
            status: "active",
            prize: "₡100,000",
        },
    ];

    const handleSaveStore = () => {
        console.log("Guardando información de tienda:", storeData);
        setIsEditingStore(false);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="max-w-7xl mx-auto w-full space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Store className="w-8 h-8" />
                            {storeData.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona tu tienda y organiza torneos
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            {storeData.status === "active"
                                ? "Tienda Activa"
                                : "Tienda Inactiva"}
                        </Badge>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditingStore(true)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Tienda
                        </Button>
                    </div>
                </div>

                {/* Información de la Tienda */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Tienda</CardTitle>
                        <CardDescription>
                            Datos principales de tu tienda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Dirección
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {storeData.address}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Contacto
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {storeData.contact}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Coins className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Sistema de Coins
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                    >
                                        {storeData.coinName}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Establecida
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {storeData.established}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-muted-foreground">
                                {storeData.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas de la Tienda */}
                {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                                    <Trophy className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {storeStats.totalTournaments}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Torneos Total
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {storeStats.activeTournaments}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Activos
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
                                        {storeStats.totalPlayers}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Jugadores
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                                    <Coins className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {storeStats.monthlyRevenue}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Ingresos/Mes
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                {storeStats.rating}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Rating
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {storeStats.totalReviews}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Reseñas
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Tabs de Gestión */}
                {/* <Tabs defaultValue="tournaments" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="tournaments">
                            Mis Torneos
                        </TabsTrigger>
                        <TabsTrigger value="players">Jugadores</TabsTrigger>
                        <TabsTrigger value="analytics">Analíticas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tournaments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Mis Torneos</CardTitle>
                                        <CardDescription>
                                            Torneos organizados por tu tienda
                                        </CardDescription>
                                    </div>
                                    <Button className="bg-gradient-to-r from-blue-600 to-yellow-500">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Torneo
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myTournaments.map((tournament) => (
                                        <div
                                            key={tournament.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg">
                                                    <Trophy className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">
                                                        {tournament.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {tournament.date} •{" "}
                                                        {
                                                            tournament.participants
                                                        }{" "}
                                                        participantes •{" "}
                                                        {tournament.prize}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        tournament.status ===
                                                        "active"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {tournament.status ===
                                                    "active"
                                                        ? "Activo"
                                                        : "Finalizado"}
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="players" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Jugadores de mi Tienda</CardTitle>
                                <CardDescription>
                                    Jugadores que participan en tus torneos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Lista de Jugadores
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Aquí aparecerán los jugadores
                                        registrados en tu tienda
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analíticas de la Tienda</CardTitle>
                                <CardDescription>
                                    Estadísticas y métricas de rendimiento
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Dashboard de Analíticas
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Gráficos y estadísticas detalladas de tu
                                        tienda
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs> */}

                {/* Modal de Edición de Tienda */}
                <Dialog open={isEditingStore} onOpenChange={setIsEditingStore}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Mi Tienda</DialogTitle>
                            <DialogDescription>
                                Actualiza la información de tu tienda
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Nombre de la Tienda
                                </Label>
                                <Input
                                    id="name"
                                    value={storeData.name}
                                    onChange={(e) =>
                                        setStoreData({
                                            ...storeData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Textarea
                                    id="address"
                                    value={storeData.address}
                                    onChange={(e) =>
                                        setStoreData({
                                            ...storeData,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact">Contacto</Label>
                                <Input
                                    id="contact"
                                    value={storeData.contact}
                                    onChange={(e) =>
                                        setStoreData({
                                            ...storeData,
                                            contact: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="coinName">
                                    Nombre de la Coin
                                </Label>
                                <Input
                                    id="coinName"
                                    value={storeData.coinName}
                                    onChange={(e) =>
                                        setStoreData({
                                            ...storeData,
                                            coinName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={storeData.description}
                                    onChange={(e) =>
                                        setStoreData({
                                            ...storeData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditingStore(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveStore}>
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
