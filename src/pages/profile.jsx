import { useEffect, useState, useContext } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import {
    Edit,
    Mail,
    Calendar,
    Shield,
    User,
    Trophy,
    Target,
    Award,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/use-session";

export const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: "Javier Mora",
        email: "javier@email.com",
        memberSince: "6/20/2025",
        role: "admin", // o "jugador"
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Entrenador Pokémon apasionado con más de 5 años de experiencia en torneos competitivos.",
    });

    const stats = [
        { label: "Torneos Jugados", value: "47", icon: Trophy },
        { label: "Victorias", value: "32", icon: Award },
        { label: "Tasa de Victoria", value: "68%", icon: Target },
        { label: "Ranking Actual", value: "#156", icon: Shield },
    ];

    const achievements = [
        {
            title: "Primer Torneo",
            description: "Completaste tu primer torneo",
            date: "Dic 2024",
        },
        {
            title: "Racha de 5",
            description: "Ganaste 5 partidas consecutivas",
            date: "Ene 2025",
        },
        {
            title: "Veterano",
            description: "Miembro por más de 6 meses",
            date: "Jun 2025",
        },
    ];

    const handleSave = () => {
        // Aquí iría la lógica para guardar los cambios
        setIsEditing(false);
        console.log("Guardando cambios:", userData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Aquí podrías revertir los cambios si es necesario
    };

    useEffect(() => {
        const cargarPerfil = async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                setUserData({
                    avatar: "",
                    bio: "",
                    email: data.usuario.email,
                    name: data.usuario.nombre,
                    memberSince: data.usuario.createdAt,
                    role: data.usuario.rol,
                });
            } catch (error) {
                console.error("Error al obtener perfil:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        cargarPerfil();
    }, [navigate]);

    if (isLoading)
        return <p className="text-center mt-4">Cargando perfil...</p>;

    return (
        <>
            {/* <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">
                    Perfil de Usuario
                </h2>
                <p>
                    <strong>Nombre:</strong> {userData.nombre}
                </p>
                <p>
                    <strong>Email:</strong> {userData.email}
                </p>
                <p>
                    <strong>Miembro desde:</strong>{" "}
                    {new Date(userData.createdAt).toLocaleDateString()}
                </p>
            </div> */}

            {/* new design  */}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header del Perfil */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                                        <AvatarImage
                                            src={
                                                userData.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={userData.name}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {userData.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!isEditing && (
                                        <Button
                                            size="sm"
                                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                        <h1 className="text-2xl md:text-3xl font-bold">
                                            {userData.name}
                                        </h1>
                                        <Badge
                                            variant={
                                                userData.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={`w-fit ${
                                                userData.role === "admin"
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                    : "bg-gradient-to-r from-blue-600 to-cyan-600"
                                            }`}
                                        >
                                            {userData.role === "admin" ? (
                                                <>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Administrador
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-3 h-3 mr-1" />
                                                    Jugador
                                                </>
                                            )}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{userData.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Miembro desde{" "}
                                                {userData.memberSince}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground max-w-2xl">
                                        {userData.bio}
                                    </p>
                                </div>

                                {!isEditing && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Editar Perfil
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulario de Edición */}
                    {isEditing && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Editar Perfil</CardTitle>
                                <CardDescription>
                                    Actualiza tu información personal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            value={userData.name}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    className="space-y-2"
                                    style={{
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={userData.role}
                                        onValueChange={(value) =>
                                            setUserData({
                                                ...userData,
                                                role: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jugador">
                                                Jugador
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Administrador
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biografía</Label>
                                    <textarea
                                        id="bio"
                                        className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                                        value={userData.bio}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                bio: e.target.value,
                                            })
                                        }
                                        placeholder="Cuéntanos sobre ti..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button onClick={handleSave}>
                                        Guardar Cambios
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg">
                                            <stat.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Información Detallada */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Información Personal */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Nombre Completo
                                    </span>
                                    <span className="font-medium">
                                        {userData.name}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Email
                                    </span>
                                    <span className="font-medium">
                                        {userData.email}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Rol
                                    </span>
                                    <Badge
                                        variant={
                                            userData.role === "admin"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {userData.role === "admin"
                                            ? "Administrador"
                                            : "Jugador"}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">
                                        Miembro desde
                                    </span>
                                    <span className="font-medium">
                                        {userData.memberSince}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logros */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logros Recientes</CardTitle>
                                <CardDescription>
                                    Tus últimos logros desbloqueados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {achievements.map((achievement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Award className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {achievement.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actividad Reciente */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                            <CardDescription>
                                Tus últimas partidas y torneos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                        <div>
                                            <p className="font-medium">
                                                Torneo Semanal #47
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Posición: 3er lugar
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Hace 2 días
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Target className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium">
                                                Partida Clasificatoria
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Victoria contra Alex_Trainer
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Hace 5 días
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium">
                                                Logro Desbloqueado
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Racha de 5 victorias
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Hace 1 semana
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Profile;
